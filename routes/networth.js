const express = require('express');
const router = express.Router();
const db = require('../config/db');
const stockService = require('../services/stockService');


// GET /api/networth
router.get('/', async (req, res) => {
    try {
        // table net_worth has columns: date, net_worth
        const [rows] = await db.pool.query('SELECT date, net_worth FROM net_worth ORDER BY date ASC');
        console.log(`Returning ${rows.length} net worth records from database`);

        const yesterdayObj = new Date();
        yesterdayObj.setDate(yesterdayObj.getDate() - 1);
        const yesterday = yesterdayObj.toISOString().split('T')[0];

        // 提前声明
        const [investments_rows] = await db.pool.query('SELECT shares, symbol FROM investments');
        const symbols = investments_rows.map(row => row.symbol);
        if (rows.length === 0 || rows[rows.length - 1].date.toLocaleDateString('sv-SE') < yesterday) {
            // use stockService to calculate today's net worth

            console.log(`returning ${investments_rows.length} investments from database`);

            console.log(`Starting to fetch previous close prices for investments: ${symbols.join(', ')}`);
            // fetch yesterday's prices for all symbols in investments
            const symbolYesterdayPricesMap = await stockService.fetchYesterdayPricesBySymbol(symbols);

            console.log(`Start calculate ${yesterday} total_net_worth `);
            let yesterdayNetWorth = 0;
            investments_rows.forEach(row => {
                const yesterdayPrice = symbolYesterdayPricesMap[row.symbol];
                if (yesterdayPrice) {
                    yesterdayNetWorth += yesterdayPrice * row.shares;
                }
            });

            rows.push({ date: yesterday, net_worth: yesterdayNetWorth.toFixed(2) }); // 添加新插入的行到结果中

            await db.pool.query('INSERT INTO net_worth (date, net_worth) VALUES (?, ?)', [yesterday, yesterdayNetWorth.toFixed(2)]);
            console.log(`Inserted new row for yesterday: ${yesterday}, net_worth: ${yesterdayNetWorth.toFixed(2)}`);
        }

        // calculate today value
        console.log(`Starting to fetch current prices for investments: ${symbols.join(', ')}`);
        // fetch today's prices for all symbols in investments
        const symbolPricesMap = await stockService.fetchPricesBySymbol(symbols);
        // get today date
        const today = new Date().toISOString().split('T')[0];

        console.log(`Start calculate ${today} total_net_worth`);

        let todayNetWorth = 0;
        investments_rows.forEach(row => {
            const todayPrice = symbolPricesMap[row.symbol];
            if (todayPrice) {
                todayNetWorth += todayPrice * row.shares;
            }
        });
        rows.push({ date: today, net_worth: todayNetWorth.toFixed(2) }); // 添加新插入的行到结果中

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;

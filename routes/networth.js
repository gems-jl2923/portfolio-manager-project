const express = require('express');
const router = express.Router();
const db = require('../config/db');
const stockService = require('../services/stockService');


// GET /api/networth
router.get('/', async (req, res) => {
    try {
        // table net_worth has columns: date, net_worth
        const [rows] = await db.pool.query('SELECT date, net_worth FROM net_worth ORDER BY date ASC');
        // check the earliest date is today ? if not create a new row today
        const today = new Date().toISOString().split('T')[0]; // 获取今天的日期，格式为 YYYY-MM-DD
        if (rows.length === 0 || rows[rows.length - 1].date.toLocaleDateString('sv-SE') !== today) {
            // use stockService to calculate today's net worth
            const [investments_rows] = await db.pool.query('SELECT shares, symbol FROM investments');
            
            const symbols = investments_rows.map(row => row.symbol);

            const symbolPricesMap = await stockService.fetchPricesBySymbol(symbols);

            let today_net_worth = 0;
            investments_rows.forEach(row => {
                const currentPrice = symbolPricesMap[row.symbol];
                if (currentPrice) {
                    console.log(`Calculate ${today} total_net_worth : Current price for ${row.symbol}: ${currentPrice}`);
                    today_net_worth += currentPrice * row.shares;
                }
            });

            const [result] = await db.pool.query('INSERT INTO net_worth (date, net_worth) VALUES (?, ?)', [today, today_net_worth]);
            console.log(`Inserted new row for today: ${today}`);
            rows.push({ date: today, net_worth: 0 }); // 添加新插入的行到结果中
            res.json(rows);
        }
        res.json(rows);
    }catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    });

module.exports = router;

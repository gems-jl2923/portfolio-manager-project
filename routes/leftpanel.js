const express = require('express');
const router = express.Router();
const db = require('../config/db'); // 使用的是 mysql2/promise
const stockService = require('../services/stockService'); 

// 获取 Cash 数据
router.get('/cash', async (req, res) => {
    try {
        const [rows] = await db.pool.query('SELECT * FROM cash_accounts');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 获取 Investment 数据
router.get('/investments', async (req, res) => {
    try {
        // rows is an array of { id, name,symbols, shares, last_updated }
        const [rows] = await db.pool.query('SELECT * FROM investments');

        // use stockService to get current prices
        const symbolPricesMap =  stockService.fetchPricesBySymbol(rows.symbols);

        // change the rows's total_value to current price * shares
        rows.forEach(row => {
            const currentPrice = symbolPricesMap[row.symbol];
            if (currentPrice) {
                console.log(`Current price for ${row.name}: ${currentPrice}`);
                row.total_value = currentPrice * row.shares;
            }
        });

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

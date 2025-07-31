const express = require('express');
const router = express.Router();
const db = require('../config/db'); // 使用的是 mysql2/promise
const stockService = require('../services/stockService');

// 获取 Cash 数据
router.get('/cash', async (req, res) => {
    try {
        const [rows] = await db.pool.query('SELECT * FROM cash_accounts');
        console.log(`returning ${rows.length} cash accounts from database`);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 获取 Investment 数据
router.get('/investments', async (req, res) => {
    try {
        // rows is an array of { id, name,symbol, shares, last_updated }
        const [rows] = await db.pool.query('SELECT * FROM investments');

        const symbols = rows.map(row => row.symbol).flat();

        // use stockService to get current prices
        console.log(`Starting to fetch current prices for investments:`);

        const symbolPricesMap = await stockService.fetchPricesBySymbol(symbols);

        // change the rows's total_value to current price * shares
        symbols.forEach((symbol, index) => {
            const currentPrice = symbolPricesMap[symbol];
            if (currentPrice >= 0) {
                console.log(`Current price for ${symbol}: ${currentPrice}`);
                const total_value = currentPrice * rows[index].shares;
                rows[index].total_value = total_value;
            }
        });

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ 新增 API：获取所有投资股票的 symbol 名称（例如用于 Sell 表单的下拉列表）
router.get('/investments/symbols', async (req, res) => {
    try {
        const { pool } = require('../config/db');
        const [results] = await db.pool.execute('SELECT name FROM investments');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

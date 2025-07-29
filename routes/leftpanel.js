const express = require('express');
const router = express.Router();
const db = require('../config/db'); // 使用的是 mysql2/promise

// 获取 Cash 数据
router.get('/cash', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM cash_accounts');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 获取 Investment 数据
router.get('/investments', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM investments');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db');


// GET /api/networth
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.pool.query('SELECT date, net_worth FROM net_worth ORDER BY date ASC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;

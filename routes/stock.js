const express = require('express');
const router = express.Router();
const db = require('../config/db'); // 这个 db 已经是 promise pool

router.get('/symbols', async (req, res) => {
  try {
    const { pool } = require('../config/db');
    const [results] = await pool.query('SELECT name FROM stock'); // ✅ 直接用 query()
    res.json(results);
  } catch (err) {
    console.error('Error fetching stock symbols:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

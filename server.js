const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 3000;

// 配置静态文件路径
app.use(express.static(path.join(__dirname, 'views')));

// 创建 MySQL 连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'n3u3da!',
    database: 'portfolio'
});

// Net Worth API
app.get('/api/networth', (req, res) => {
    pool.query(
        'SELECT date, net_worth FROM net_worth ORDER BY date ASC',
        (err, results) => {
            if (err) {
                console.error('MySQL query error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        }
    );
});

// 启动服务
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

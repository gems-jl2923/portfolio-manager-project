const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 提供静态 HTML 页面
app.use(express.static(path.join(__dirname, 'views')));

// API 路由，提供净资产数据
app.get('/api/networth', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'networth.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read data' });
        } else {
            const parsedData = JSON.parse(data);
            res.json(parsedData);
        }
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

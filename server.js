const express = require('express');
const app = express();
const path = require('path');
const networthRoutes = require('./routes/networth');

app.use(express.static('views')); // dashboard.html 放在 views 文件夹
app.use('/api/networth', networthRoutes); // 注册 API 路由

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

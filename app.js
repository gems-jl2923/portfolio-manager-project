const express = require('express');
const app = express();
const path = require('path');
const networthRoutes = require('./routes/networth');
const leftPanelRoutes = require('./routes/leftpanel');
const stockRoutes = require('./routes/stock');
const portfolioRoutes = require('./routes/portfolioRoutes');
const sellStockRoutes = require('./routes/sell_stock');

app.use(express.static('views')); // dashboard.html 放在 views 文件夹
app.use(express.json());
app.use('/api/networth', networthRoutes); // 注册 API 路由
app.use('/api/left', leftPanelRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/portfolio', portfolioRoutes); // ✅ 路由注册
app.use('/', portfolioRoutes);
app.use('/api/sellstock', sellStockRoutes); // ✅ 卖出股票的路由


// TODO: use app.locals.datePricesMap to fetch prices once, datePricesMap is a dictionary : {date:prices}
// If app.locals.datePricesMap is empty, fetch prices from stockService and store in app.locals.datePricesMap
// If app.locals.datePricesMap is not empty, it will be used to calculate in EVERY ROUTER!


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');
const networthRoutes = require('./routes/networth');
const leftPanelRoutes = require('./routes/leftpanel');
const stockRoutes = require('./routes/stock');
const portfolioRoutes = require('./routes/portfolioRoutes');
const sellStockRoutes = require('./routes/sell_stock');
const stockService = require('./services/stockService');
const db = require('./config/db');

const app = express();

app.use(express.static('views'));
app.use(express.json());
app.use('/api/networth', networthRoutes);
app.use('/api/left', leftPanelRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/', portfolioRoutes);
app.use('/api/sellstock', sellStockRoutes);


const API_KEY = 'd25hsphr01qns40f17qgd25hsphr01qns40f17r0';
const SYMBOL_LIST_API = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${API_KEY}`;
// 初始化 app.locals，避免 undefined
app.locals.symbolsPricesMap = {};
app.locals.symbolMap = {};

async function getwghatevr() {
    try {
        console.log(`Starting to fetch current prices for map:`);
        const [rows] = await db.pool.query('SELECT * FROM investments');

        if (rows.length === 0) {
            console.log('No investments found in DB.');
            app.locals.symbolsPricesMap = {};
            return;
        }

        const symbols = rows.map(row => row.symbol);
        console.log('Fetching prices for symbols:', symbols);

        const pricesMap = await stockService.fetchPricesBySymbol(
            symbols,
            "d25hsd9r01qns40f15vgd25hsd9r01qns40f1600"
        );

        const response = await fetch(SYMBOL_LIST_API);
        const data = await response.json();

        // 构造 Map：symbol -> name
        cachedSymbolMap = new Map();
        console.log(`Found ${data.length} symbols in API response. Constructing symbol map...`);
        data.forEach(item => {
            if (item.symbol && item.description) {
                console.log(`Fetching symbol: ${item.symbol} with description: ${item.description}`);
                cachedSymbolMap.set(item.symbol, item.description);
            }
        });

        app.locals.symbolsPricesMap = pricesMap;
        app.locals.symbolMap = cachedSymbolMap;
        console.log(`✅ Successfully loaded ${Object.keys(cachedSymbolMap).length} symbols.`);
        console.log(`✅ Successfully loaded ${Object.keys(pricesMap).length} prices.`);
    } catch (err) {
        console.error(`❌ Error in getwghatevr: ${err.message}`);
        throw err; // 让调用者知道失败了
    }
}

async function startServer() {
    try {
        // ✅ 1. 等待首次数据加载完成
        await getwghatevr();
        console.log('✅ Initial price map loaded. Starting server...');

        // ✅ 2. 启动定时更新（每分钟）
        setInterval(async () => {
            try {
                await getwghatevr();
                console.log(`🔄 Price map refreshed.`);
            } catch (err) {
                console.error(`📌 Auto-update failed: ${err.message}`);
            }
        }, 5 * 60 * 1000);

        // ✅ 3. 最后启动服务器
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1); // 启动失败，退出进程
    }
}

// ✅ 启动服务器（会先等 getwghatevr 完成）
startServer();
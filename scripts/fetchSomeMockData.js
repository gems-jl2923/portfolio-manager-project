const db = require('../config/db');
const stockService = require('../services/stockService');

// get stock name, symbol and price
// name for show in left panel, symbol for search in finnhub API
(async () => {
    try {
        const jsonPairs = await stockService.fetchStockNameSymbolPrice();
        console.log('jsonPairs', jsonPairs);

        const nameSymbolMap = jsonPairs.nameSymbolMap;
        const symbolPricesMap = jsonPairs.symbolPricesMap;

        // Insert stock name, symbol into the database
        for (const [name, symbol] of Object.entries(nameSymbolMap)) {
            const query = 'INSERT INTO investments (name, symbol, shares) VALUES (?, ?, ?)';
            // random shares for mock data
            const shares = Math.floor(Math.random() * (10000 - 100 + 1) );
            await db.pool.query(query, [name, symbol, shares]);
        }

        // 打印插入后的数据库内容
        const [rows] = await db.pool.query('SELECT * FROM investments');
        console.log('Current investments:', rows);
    } catch (err) {
        console.error('Error:', err);
    }
    process.exit(0); // 运行完自动退出

})();
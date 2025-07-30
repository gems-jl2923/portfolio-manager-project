const fetch = require('node-fetch'); // 如果用ESM请用 import fetch from 'node-fetch'
const API_KEY = 'd246ndpr01qmb590rj80d246ndpr01qmb590rj8g';
const SYMBOL_LIST_API = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${API_KEY}`;
const QUOTE_API = (symbol) => `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

/**
 * 获取前10个美股的名称、symbol和当前价格
 * 返回 { nameSymbolMap, symbolPricesMap }
 */
async function fetchStockNameSymbolPrice() {
    try {
        // 获取股票symbol列表
        const response = await fetch(SYMBOL_LIST_API);
        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('Invalid data from symbol list API');
        }

        const symbols = data.slice(0, 10).map(item => item.symbol).filter(Boolean);
        const names = data.slice(0, 10).map(item => item.description).filter(Boolean);

        const nameSymbolMap = {};
        names.forEach((name, index) => {
            nameSymbolMap[name] = symbols[index];
        });

        const symbolPricesMap = {};

        // 获取每个symbol的价格
        const fetches = symbols.map(async (symbol) => {
            try {
                const quoteRes = await fetch(QUOTE_API(symbol));
                const quoteData = await quoteRes.json();

                if (quoteData && typeof quoteData.c === 'number') {
                    symbolPricesMap[symbol] = quoteData.c;
                }
            } catch (e) {
                console.warn(`Failed to fetch price for ${symbol}`);
            }
        });

        await Promise.all(fetches);

        return { nameSymbolMap, symbolPricesMap };

    } catch (err) {
        console.error('Fetch stock info failed:', err);
        throw err;
    }
}

// fetch price by symbol
async function fetchPricesBySymbol(symbols) {
    const symbolPricesMap = {};
    // 获取每个symbol的价格
    const fetches = symbols.map(async (symbol) => {
        try {
            const quoteRes = await fetch(QUOTE_API(symbol));
            const quoteData = await quoteRes.json();

            if (quoteData && typeof quoteData.c === 'number') {
                symbolPricesMap[symbol] = quoteData.c;
            }
        } catch (e) {
            console.warn(`Failed to fetch price for ${symbol}`);
        }
    });

    await Promise.all(fetches);

    return {symbolPricesMap};

}


module.exports = {
    fetchStockNameSymbolPrice, fetchPricesBySymbol
};
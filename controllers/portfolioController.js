const pool = require('../config/db');

const API_KEY = 'd246ndpr01qmb590rj80d246ndpr01qmb590rj8g';
const SYMBOL_LIST_API = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${API_KEY}`;
const QUOTE_API = (symbol) => `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

exports.getStockInfo = async (req, res) => {
    try {
      // Get stock symbol list
      const response = await fetch(SYMBOL_LIST_API);
      const data = await response.json();
  
      if (!Array.isArray(data)) {
        return res.status(500).json({ error: 'Invalid data from symbol list API' });
      }
  
      const symbols = data.slice(0, 10).map(item => item.symbol).filter(Boolean);
  
      const stockPrices = {};
  
      // Fetch stock price for each symbol  
      const fetches = symbols.map(async (symbol) => {
        try {
          const quoteRes = await fetch(QUOTE_API(symbol));
          const quoteData = await quoteRes.json();
  
          if (quoteData && typeof quoteData.c === 'number') {
            stockPrices[symbol] = quoteData.c;
          }
        } catch (e) {
          console.warn(`Failed to fetch price for ${symbol}`);
        }
      });
  
      await Promise.all(fetches);
  
      return res.json(stockPrices);
  
    } catch (err) {
      console.error('Fetch stock info failed:', err);
      return res.status(500).json({ error: 'Failed to fetch stock info' });
    }
  };




// exports.getStockList = async (req, res) => {
//     try {
//         const response = await fetch(FINNHUB_API_URL);
//         const data = await response.json();

//         if (!Array.isArray(data)) {
//             return res.status(500).json({ error: 'Invalid data format from external API' });
//           }

//         const symbolList = data.map(item => item.symbol).filter(Boolean);
          
//         return res.json({ stock_list: symbolList });

//     } catch (error) {
//         console.error('Fetch stock list failed:', error);
//         return res.status(500).json({ error: 'Failed to fetch stock list' });
//     }
// };



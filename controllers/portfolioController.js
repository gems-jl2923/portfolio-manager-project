const pool = require('../config/db');

const API_KEY = 'd246ndpr01qmb590rj80d246ndpr01qmb590rj8g';
const SYMBOL_LIST_API = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${API_KEY}`;
const QUOTE_API = (symbol) => `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

// Define the cached stock symbols
let cachedSymbols = null;

async function isValidSymbol(symbol) {
  if (!cachedSymbols) {
    const response = await fetch(SYMBOL_LIST_API);
    const data = await response.json();

    if (!Array.isArray(data)) return false;

    cachedSymbols = new Set(data.map(item => item.symbol));
  }

  return cachedSymbols.has(symbol);
}

// Function of outputting all stocks symbols and current price of each stock 
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


// Function of buy stocks
exports.buyStock = async (req, res) => {
    const { symbol, shares } = req.body;

    if (!symbol || typeof shares !== 'number' || shares <= 0) {
        return res.status(400).json({ error: 'Invalid parameters: symbol or shares' });
      }
    
    try{
        const valid = await isValidSymbol(symbol);
        if (!valid) {
          return res.status(400).json({ error: `Invalid symbol: ${symbol} does not exist.` });
        }

        const quoteRes = await fetch(QUOTE_API(symbol));
        const quoteData = await quoteRes.json();

        if (!quoteData || typeof quoteData.c !== 'number') {
            return res.status(400).json({ error: `Failed to get price for ${symbol}` });
          }
      
        const currentPrice = quoteData.c;
        const thisValue = parseFloat((currentPrice * shares).toFixed(2));

        // Check if the stock already exists in the database
        const [rows] = await pool.query(
            'SELECT shares, total_value FROM investments WHERE name = ?',
            [symbol]);

        let result;

        if (rows.length > 0) {
            // If exists, update shares and total_value
            const existingShares = rows[0].shares;
            const existingValue = parseFloat(rows[0].total_value);
            const newShares = existingShares + shares;
            const newValue = (existingValue + thisValue).toFixed(2);

            [result] = await pool.query(
                'UPDATE investments SET shares = ?, total_value = ?, last_updated = NOW() WHERE name = ?',
                [newShares, newValue, symbol]
            );
        } else {
            // If not exists, insert new record
            [result] = await pool.query(
                'INSERT INTO investments (name, shares, total_value) VALUES (?, ?, ?)',
                [symbol, shares, thisValue]
            );

            return res.status(201).json({
                success: true,
                message: `Purchased ${shares} shares of ${symbol} at $${currentPrice}`,
                investment_id: result.insertId
              });
        }

    } catch (error) {
        console.error('Buy stock failed:', error);
        return res.status(500).json({ error: 'Failed to buy stock' });
    }
}


// Function of outputting all stocks symbols and store in a List
exports.getStockList = async (req, res) => {
    try {
        const response = await fetch(SYMBOL_LIST_API);
        const data = await response.json();

        if (!Array.isArray(data)) {
            return res.status(500).json({ error: 'Invalid data format from external API' });
          }

        const symbolList = data.map(item => item.symbol).filter(Boolean);
          
        return res.json({ stock_list: symbolList });

    } catch (error) {
        console.error('Fetch stock list failed:', error);
        return res.status(500).json({ error: 'Failed to fetch stock list' });
    }
};



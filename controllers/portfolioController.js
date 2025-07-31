const { pool } = require('../config/db');
const API_KEY = 'd25hsphr01qns40f17qgd25hsphr01qns40f17r0';


const QUOTE_API = (symbol) => `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

// Define the cached stock symbols
let cachedSymbolMap = null;

// async function getSymbolMap() {
//   if (!cachedSymbolMap) {

//   }
//   return cachedSymbolMap;
// }


// Function of buy stocks
exports.buyStock = async (req, res) => {
  const { symbol, shares } = req.body;

  if (!symbol || typeof shares !== 'number' || shares <= 0) {
    return res.status(400).json({ error: 'Invalid parameters: symbol or shares' });
  }

  try {
    const symbolMap = req.app.locals.symbolMap;
    if (!symbolMap || !symbolMap.has(symbol)) {
      return res.status(400).json({ error: `Invalid symbol: ${symbol} does not exist.` });
    }

    const stockName = symbolMap.get(symbol); // Stock Description

    let cost = 0;
    let currentPrice = 0;
    if (req.app.locals.symbolsPricesMap[symbol]) {
      // Use cached price
      currentPrice = req.app.locals.symbolsPricesMap[symbol];
      cost = parseFloat((currentPrice * shares).toFixed(2));

      console.log(`Using cached price for ${symbol}: $${currentPrice}`);
      console.log(`Total cost for ${shares} shares: $${cost}`);

      if (isNaN(cost) || cost <= 0) {
        return res.status(400).json({ error: `Invalid cost calculation for ${symbol}` });
      }
    } else {
      // Fetch current price
      const quoteRes = await fetch(QUOTE_API(symbol));
      const quoteData = await quoteRes.json();
      if (!quoteData || typeof quoteData.c !== 'number') {
        return res.status(400).json({ error: `Failed to get price for ${symbol}` });
      }

      currentPrice = quoteData.c;
      cost = parseFloat((currentPrice * shares).toFixed(2));

      req.app.locals.symbolsPricesMap[symbol] = currentPrice; // Update the price in the map

    }

    // Query 
    const [[cashRow]] = await pool.query(
      'SELECT balance FROM cash_accounts WHERE id = ?',
      [1]
    );

    if (!cashRow) {
      return res.status(500).json({ error: 'Cash account not found' });
    }

    const currentBalance = parseFloat(cashRow.balance);
    if (cost > currentBalance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Query if stock exists
    const [rows] = await pool.query(
      'SELECT shares FROM investments WHERE symbol = ?',
      [symbol]
    );

    let result;
    if (rows.length > 0) {
      const existingShares = rows[0].shares;
      const newShares = existingShares + shares;

      [result] = await pool.query(
        'UPDATE investments SET shares = ?, last_updated = NOW() WHERE symbol = ?',
        [newShares, symbol]
      );
    } else {
      [result] = await pool.query(
        'INSERT INTO investments (name, symbol, shares) VALUES (?, ?, ?)',
        [stockName, symbol, shares]
      );
    }

    // Update balance
    await pool.query(
      'UPDATE cash_accounts SET balance = balance - ?, last_updated = NOW() WHERE id = ?',
      [cost, 1]
    );

    return res.status(200).json({
      success: true,
      message: `Purchased ${shares} shares of ${symbol} at $${currentPrice}`,
      cost,
      remaining_balance: (currentBalance - cost).toFixed(2)
    });

  } catch (err) {
    console.error('Buy stock failed:', err);
    return res.status(500).json({ error: 'Failed to buy stock' });
  }
};



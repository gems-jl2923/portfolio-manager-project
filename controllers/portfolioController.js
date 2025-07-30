const pool = require('../config/db');

const API_KEY = 'd246ndpr01qmb590rj80d246ndpr01qmb590rj8g';
const SYMBOL_LIST_API = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${API_KEY}`;
const QUOTE_API = (symbol) => `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

// Define the cached stock symbols
let cachedSymbolMap = null;

async function getSymbolMap() {
  if (!cachedSymbolMap) {
    const response = await fetch(SYMBOL_LIST_API);
    const data = await response.json();

    if (!Array.isArray(data)) return null;

    // 构造 Map：symbol -> name
    cachedSymbolMap = new Map();
    data.forEach(item => {
      if (item.symbol && item.description) {
        cachedSymbolMap.set(item.symbol, item.description);
      }
    });
  }
  return cachedSymbolMap;
}


// Function of buy stocks
exports.buyStock = async (req, res) => {
  const { symbol, shares } = req.body;

  if (!symbol || typeof shares !== 'number' || shares <= 0) {
    return res.status(400).json({ error: 'Invalid parameters: symbol or shares' });
  }

  try {
    const symbolMap = await getSymbolMap();
    if (!symbolMap || !symbolMap.has(symbol)) {
      return res.status(400).json({ error: `Invalid symbol: ${symbol} does not exist.` });
    }

    const stockName = symbolMap.get(symbol); // Stock Description

    // Fetch current price
    const quoteRes = await fetch(QUOTE_API(symbol));
    const quoteData = await quoteRes.json();
    if (!quoteData || typeof quoteData.c !== 'number') {
      return res.status(400).json({ error: `Failed to get price for ${symbol}` });
    }

    const currentPrice = quoteData.c;
    const cost = parseFloat((currentPrice * shares).toFixed(2));

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



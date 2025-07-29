const pool = require('../config/db');

const API_KEY = 'd246ndpr01qmb590rj80d246ndpr01qmb590rj8g';
const FINNHUB_API_URL = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${API_KEY}`;


exports.getStockList = async (req, res) => {
    try {
        const response = await fetch(FINNHUB_API_URL);
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


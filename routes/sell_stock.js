const express = require('express');
const router = express.Router();
const { pool } = require('../config/db'); // ✅ Properly import database connection pool
const https = require('https');
const { URL } = require('url');

const API_KEY = 'd25hsphr01qns40f17qgd25hsphr01qns40f17r0';
const QUOTE_API = (symbol) => `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

// Helper function: fetch stock price from Finnhub
const getStockPrice = (symbol) => {
    return new Promise((resolve, reject) => {
        const url = new URL(QUOTE_API(symbol));

        const req = https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.c !== null && !isNaN(result.c)) {
                        resolve(result.c);
                    } else {
                        reject(new Error('Failed to retrieve a valid stock price from API response.'));
                    }
                } catch (err) {
                    reject(new Error('Failed to parse stock price data: ' + err.message));
                }
            });
        });

        req.on('error', (err) => {
            reject(new Error('Error occurred while fetching stock price: ' + err.message));
        });
    });
};

// API route to sell stocks
router.post('/sell', async (req, res) => {
    const { stockSymbol, sharesToSell } = req.body;

    if (!stockSymbol || !sharesToSell) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }

    // Validate sharesToSell is a positive number
    if (sharesToSell <= 0 || isNaN(sharesToSell)) {
        return res.status(400).json({ error: 'Number of shares to sell must be a positive number.' });
    }

    try {
        // Query current stock holding info (symbol and shares)
        const [investments] = await pool.execute(
            "SELECT symbol, shares FROM investments WHERE name = ?",
            [stockSymbol]
        );

        if (!investments || investments.length === 0) {
            return res.status(404).json({ error: 'Stock not found in portfolio.' });
        }

        const { symbol: stockSname, shares: currentShares } = investments[0];

        // Ensure user is not selling more shares than owned
        if (sharesToSell > currentShares) {
            return res.status(400).json({ error: 'Cannot sell more shares than currently held.' });
        }

        const currentPrice = req.app.locals.symbolsPricesMap[stockSname];

        if (!currentPrice || isNaN(currentPrice)) {
            return res.status(500).json({ error: 'Failed to fetch a valid stock price.' });
        }

        const transactionAmount = currentPrice * sharesToSell;
        const remainingShares = currentShares - sharesToSell;

        if (remainingShares === 0) {
            // If selling all shares, delete the investment record
            await pool.execute(
                "DELETE FROM investments WHERE name = ?",
                [stockSymbol]
            );
        } else {
            // Update remaining shares and timestamp
            await pool.execute(
                `UPDATE investments 
                 SET shares = ?, last_updated = CURRENT_TIMESTAMP 
                 WHERE name = ?`,
                [remainingShares, stockSymbol]
            );
        }

        // Update the cash balance
        await pool.execute(
            "UPDATE cash_accounts SET balance = balance + ?, last_updated = CURRENT_TIMESTAMP WHERE name = 'Fidelity Cash'",
            [transactionAmount]
        );

        res.json({
            success: true,
            details: {
                stockSymbol,
                sharesSold: sharesToSell,
                pricePerShare: currentPrice,
                totalAmount: transactionAmount,
                remainingShares // return remaining shares (0 means deleted)
            }
        });

    } catch (err) {
        console.error('Sell stock failed:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

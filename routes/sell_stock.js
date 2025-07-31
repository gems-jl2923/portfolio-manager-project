const express = require('express');
const router = express.Router();
const { pool } = require('../config/db'); // ✅ 正确导入数据库连接池
const https = require('https');
const { URL } = require('url');

const API_KEY = 'd246ndpr01qmb590rj80d246ndpr01qmb590rj8g';
const QUOTE_API = (symbol) => `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

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
                        reject(new Error('无法从API响应中获取有效的股票价格'));
                    }
                } catch (err) {
                    reject(new Error('解析股票价格数据失败: ' + err.message));
                }
            });
        });

        req.on('error', (err) => {
            reject(new Error('获取股票价格时发生错误: ' + err.message));
        });
    });
};

router.post('/sell', async (req, res) => {
    const { stockSymbol, sharesToSell } = req.body;

    if (!stockSymbol || !sharesToSell) {
        return res.status(400).json({ error: '缺少必要的参数' });
    }

    try {
        const [investments] = await pool.execute(
            "SELECT symbol FROM investments WHERE name = ?",
            [stockSymbol]
        );

        if (!investments || investments.length === 0) {
            return res.status(404).json({ error: '未找到对应股票信息' });
        }

        const stockSname = investments[0].symbol;

        const currentPrice = await getStockPrice(stockSname);

        if (!currentPrice || isNaN(currentPrice)) {
            return res.status(500).json({ error: '无法获取有效的股票价格' });
        }

        const transactionAmount = currentPrice * sharesToSell;

        await pool.execute(
            `UPDATE investments 
             SET shares = shares - ?, last_updated = CURRENT_TIMESTAMP 
             WHERE name = ?`,
            [sharesToSell, stockSymbol]
        );

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
                totalAmount: transactionAmount
            }
        });

    } catch (err) {
        console.error('售卖股票失败:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

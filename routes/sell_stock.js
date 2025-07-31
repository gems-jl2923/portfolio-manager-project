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

    // 验证卖出数量为正数
    if (sharesToSell <= 0 || isNaN(sharesToSell)) {
        return res.status(400).json({ error: '卖出数量必须是正数' });
    }

    try {
        // 查询当前股票的持仓数量和代码（增加shares字段查询）
        const [investments] = await pool.execute(
            "SELECT symbol, shares FROM investments WHERE name = ?",
            [stockSymbol]
        );

        if (!investments || investments.length === 0) {
            return res.status(404).json({ error: '未找到对应股票信息' });
        }

        const { symbol: stockSname, shares: currentShares } = investments[0];

        // 验证卖出数量不超过持仓数量
        if (sharesToSell > currentShares) {
            return res.status(400).json({ error: '卖出数量超过持仓数量' });
        }

        const currentPrice = await getStockPrice(stockSname);

        if (!currentPrice || isNaN(currentPrice)) {
            return res.status(500).json({ error: '无法获取有效的股票价格' });
        }

        const transactionAmount = currentPrice * sharesToSell;
        const remainingShares = currentShares - sharesToSell;

        if (remainingShares === 0) {
            // 全部卖出，删除记录
            await pool.execute(
                "DELETE FROM investments WHERE name = ?",
                [stockSymbol]
            );
        } else {
            // 部分卖出，更新持仓
            await pool.execute(
                `UPDATE investments 
                 SET shares = ?, last_updated = CURRENT_TIMESTAMP 
                 WHERE name = ?`,
                [remainingShares, stockSymbol]
            );
        }

        // 更新现金账户
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
                remainingShares: remainingShares // 新增返回剩余数量，0表示已删除
            }
        });

    } catch (err) {
        console.error('售卖股票失败:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

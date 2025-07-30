const express = require('express');
const router = express.Router();
const db = require('../config/db'); // 数据库配置
const https = require('https'); // 用于发起HTTPS请求
const { URL } = require('url'); // 用于处理URL

// Finnhub API配置
const API_KEY = 'd246ndpr01qmb590rj80d246ndpr01qmb590rj8g';
const QUOTE_API = (symbol) => `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

// 辅助函数：获取股票价格
const getStockPrice = (symbol) => {
    return new Promise((resolve, reject) => {
        const url = new URL(QUOTE_API(symbol));
        
        const req = https.get(url, (res) => {
            let data = '';
            
            // 接收数据
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            // 数据接收完成
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    
                    // Finnhub API返回的当前价格在c字段中（current price）
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
        
        // 处理请求错误
        req.on('error', (err) => {
            reject(new Error('获取股票价格时发生错误: ' + err.message));
        });
    });
};

// 售卖股票的接口
router.post('/sell_stock', async (req, res) => {
    const { stockSymbol, sharesToSell } = req.body;

    // 基本参数存在性检查
    if (!stockSymbol || !sharesToSell) {
        return res.status(400).json({ error: '缺少必要的参数' });
    }

    try {
        const [investments] = await db.execute(
            "SELECT symbol FROM investments WHERE name = '?'",
            [stockSymbol]
        );
        const stockSname = investments[0].stockSname;
        // 1. 使用Finnhub API获取当前股票价格
        const currentPrice = await getStockPrice(stockSname);
        
        if (!currentPrice || isNaN(currentPrice)) {
            return res.status(500).json({ error: '无法获取有效的股票价格' });
        }

        // 2. 计算交易金额
        const transactionAmount = currentPrice * sharesToSell;

        // 3. 更新投资组合中的股票份额和更新时间
        await db.execute(
            `UPDATE investments 
             SET shares = shares - ?, last_updated = CURRENT_TIMESTAMP 
             WHERE name = ?`,
            [sharesToSell, stockSymbol]
        );

        // 4. 更新现金账户余额
        await db.execute(
            "UPDATE cash_accounts SET balance = balance + ?, last_updated = CURRENT_TIMESTAMP WHERE name = 'Fidelity Cash'",
            [transactionAmount]
        );

        // 返回成功响应
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
    

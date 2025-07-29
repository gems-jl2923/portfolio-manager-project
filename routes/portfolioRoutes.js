const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// router.get('/stock_list', portfolioController.getStockList);
router.get('/getStockInfo', portfolioController.getStockInfo);
router.post('/buy_stock', portfolioController.buyStock);


module.exports = router;

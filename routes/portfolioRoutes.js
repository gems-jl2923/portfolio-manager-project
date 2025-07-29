const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// router.get('/stock_list', portfolioController.getStockList);
router.get('/getStockInfo', portfolioController.getStockInfo);


module.exports = router;

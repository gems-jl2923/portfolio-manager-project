const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

router.get('/stock_list', portfolioController.getStockList);

module.exports = router;

const express = require('express');
const coinChangeHistoryController = require("../controller/coin_change_history_controller");
const router = express.Router();

// Create CoinChangeHistory
router.post('/', coinChangeHistoryController.createCoinChangeHistory);

// Remove CoinChangeHistory
router.delete('/:coinChangeHistoryId', coinChangeHistoryController.removeCoinChangeHistory);

// Get CoinChangeHistory by ID
router.get('/:coinChangeHistoryId', coinChangeHistoryController.getCoinChangeHistoryById);

module.exports = router;
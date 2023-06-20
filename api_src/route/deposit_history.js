const express = require('express');
const router = express.Router();
const depositHistoryController = require("../controller/deposit_history_controller");


 router.get('/', depositHistoryController.getAllDepositHistories);

router.get('/:id', depositHistoryController.getDepositHistoryById);

router.post('/', depositHistoryController.createDepositHistory);

router.put('/:id', depositHistoryController.updateDepositHistoryById);

router.delete('/:id', depositHistoryController.deleteDepositHistoryById);
 module.exports = router;
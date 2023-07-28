const express = require('express');
const withdrawRequestController = require("../controller/withdraw_request_controller");
const router = express.Router();
router.post('/', withdrawRequestController.createWithdrawRequest);
 // Get all withdraw requests
router.get('/', withdrawRequestController.getAllWithdrawRequests);
 // Get a specific withdraw request by ID
router.get('/:id', withdrawRequestController.getWithdrawRequestById);
 // Update the status of a withdraw request
router.put('/:id', withdrawRequestController.updateWithdrawRequestStatus);
 // Delete a withdraw request
router.delete('/:id', withdrawRequestController.deleteWithdrawRequest);
 module.exports = router;
const express = require('express');
const billController = require("../controller/bill_controller");
const router = express.Router();
 // Lấy tất cả hóa đơn
router.get('/', billController.getBills);
 // Lấy hóa đơn theo id
router.get('/:id', billController.getBillById);
 // Tạo hóa đơn mới
router.post('/', billController.createBill);
 // Cập nhật hóa đơn
router.put('/:id', billController.updateBill);
 // Xóa hóa đơn
router.delete('/:id', billController.deleteBill);
 module.exports = router;
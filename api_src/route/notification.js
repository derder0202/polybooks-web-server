const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification_controller');
 // Tạo thông báo mới
router.post('/', notificationController.create);
 // Lấy tất cả thông báo
router.get('/', notificationController.getAll);
 // Đánh dấu thông báo đã đọc
router.put('/:id', notificationController.markAsRead);
 module.exports = router;
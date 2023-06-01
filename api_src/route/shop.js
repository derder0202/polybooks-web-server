const express = require('express');
const router = express.Router();
const shopController = require('../controller/shop_controller');

router.get('/', shopController.getShops);
router.post('/', shopController.createShop);
router.get('/:id', shopController.getShopById);
router.put('/:id', shopController.updateShop);
router.delete('/:id', shopController.deleteShop);

module.exports = router;
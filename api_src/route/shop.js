const express = require('express');
const router = express.Router();
const shopController = require('../controller/shop_controller');

router.get('/', shopController.getShops);
router.post('/', shopController.createShop);
router.get('/:id', shopController.getShopById);
router.put('/:id', shopController.updateShop);
router.delete('/:id', shopController.deleteShop);

router.get('/:id/posts', shopController.getPostsByShop);
router.get('/:id/reviews', shopController.getReviewsByShop);
router.get('/:id/sellBills', shopController.getSellBillsByShop);
router.get('/:id/statistical', shopController.get7DaysStatistical);


module.exports = router;
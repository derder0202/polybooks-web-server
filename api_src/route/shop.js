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
router.get('/:id/getAllDiscounts', shopController.getAllDiscountsByShop);
router.get('/:id/statistical', shopController.getShop7DaysStatistical);
router.post('/:id/getShopStatisticalByTime', shopController.getShopStatisticalByTime);//getShopBillStatisticalByTime
router.post('/:id/getShopBillStatisticalByTime', shopController.getShopBillStatisticalByTime);//getShopBillStatisticalByTime


module.exports = router;
const express = require('express');
const discountController = require("../controller/discount_controller");
const router = express.Router();

 // GET all discounts
router.get('/', discountController.getAllDiscounts);
 // GET discount by ID
router.get('/:id', discountController.getDiscountById);
 // CREATE new discount
router.post('/', discountController.createDiscount);
 // UPDATE discount by ID
router.put('/:id', discountController.updateDiscountById);
 // DELETE discount by ID
router.delete('/:id', discountController.deleteDiscountById);
 module.exports = router;
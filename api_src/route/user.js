
// user router
const express = require('express');
const router = express.Router();
const userController = require('../controller/user_controller');

const authMiddleware = require("../middleware/authMiddleware");
const {Bill, User} = require("../model/model");
const authenToken = require("../middleware/authentication");
// GET /users
router.post('/filter', userController.getUsers);

router.post('/login', userController.login);

router.get('/test',authenToken,async (req,res)=>{
  res.json('blabla')
});
// GET /users/:id
router.get('/:id', userController.getUserById);
// POST /users
router.post('/', userController.createUser);
// PUT /users/:id
router.put('/:id', userController.updateUser);
// DELETE /users/:id
router.delete('/:id', userController.deleteUser);

router.get('/address/:id', userController.getAddressById);

router.post('/checkPhoneNumber', userController.checkPhoneNumber);
router.post('/changePasswordByPhone', userController.changePasswordByPhone);

//add to favorite
router.post('/:id/addToFavorite', userController.addToFavorite);
router.post('/:id/removeFromFavorite', userController.removeFromFavorite);
router.get('/:id/favorite', userController.getFavoriteByUser);

//address
router.get('/:id/address', userController.getAddressByUser);
router.post('/:id/addAddress', userController.addAddress);
router.post('/:id/removeAddress', userController.removeAddress);
router.put('/editAddress/:id',userController.editAddress)

router.get('/:id/posts', userController.getPostsByUser);
router.get('/:id/reviews', userController.getReviewsByUser);
router.get('/:id/notification', userController.getNotificationsByUser);
router.get('/:id/buyBills', userController.getBuyBillsByUser);
router.get('/:id/sellBills', userController.getSellBillsByUser);
router.get('/:id/withdrawRequests', userController.getWithdrawRequestsByUser);
router.get('/:id/depositHistories', userController.getDepositHistoryByUser);

module.exports = router;
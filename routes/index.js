var express = require('express');
const {Post} = require("../api_src/model/model");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('authentication/login-page');
});

/* Statistical */
router.get('/account_statistics', function(req, res, next) {
  res.render('statistical/account_statistics');
});
router.get('/aution_statistics', function(req, res, next) {
  res.render('statistical/aution_statistics');
});
router.get('/books_sale_statistics', function(req, res, next) {
  res.render('statistical/books_sale_statistics');
});
router.get('/stall_statistics', function(req, res, next) {
  res.render('statistical/stall_statistics');
});
router.get('/transaction_statistics', function(req, res, next) {
  res.render('statistical/transaction_statistics');
});

/* Regular Member */
router.get('/add_regular_member', function(req, res, next) {
  res.render('regular_member/add_regular_member');
});
router.get('/edit_regular_member', function(req, res, next) {
  res.render('regular_member/edit_regular_member');
});
router.get('/list_regular_member', function(req, res, next) {
  res.render('regular_member/list_regular_member');
});
router.get('/update_regular_member', function(req, res, next) {
  res.render('regular_member/update_regular_member');
});

/* VIP Member */

router.get('/list_vip_member', function(req, res, next) {
  res.render('vip_member/list_vip_member');
});
router.get('/payment_vip_member', function(req, res, next) {
  res.render('vip_member/payment_vip_member');
});
router.get('/update_vip_member', function(req, res, next) {
  res.render('vip_member/update_vip_member');
});

/* Aution Post */
router.get('/list_aution_post', function(req, res, next) {
  res.render('aution_post/list_aution_post');
});

/* Content Approval */
router.get('/book_approval', function(req, res, next) {
  res.render('content_approval/book_approval');
});
router.get('/new_approval', function(req, res, next) {
  res.render('content_approval/new_approval');
});

/* Report */

router.get('/pending_report', function(req, res, next) {
  res.render('report/pending_report');
});
router.get('/processed_report', function(req, res, next) {
  res.render('report/processed_report');
});

/* Ad */
router.get('/ad_management', function(req, res, next) {
  res.render('advertisement/ad_management');
});








router.get('/admin_account_info', function(req, res, next) {
  res.render('admin_account/admin_account_info');
});

/* Authentication */

router.get('/login-page', function(req, res, next) {
  res.render('authentication/login-page');
});
router.get('/register-page', function(req, res, next) {
  res.render('authentication/register-page');
});
router.get('/forgot-password-page', function(req, res, next) {
  res.render('authentication/forgot-password-page');
});




module.exports = router;

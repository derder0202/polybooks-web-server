var express = require('express');
const {Post} = require("../api_src/model/model");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('authentication/login-page');
});

router.get('/listUsers', function(req, res, next) {
  res.render('users/listUsers');
});
router.get('/editUser', function(req, res, next) {
  res.render('users/editUser');
});
router.get('/addUser', function(req, res, next) {
  res.render('users/addUser');
});
router.get('/listPosts', function(req, res, next) {
  res.render('posts/listPosts');
});
router.get('/account-info', function(req, res, next) {
  res.render('account/account-info');
});
router.get('/login-page', function(req, res, next) {
  res.render('authentication/login-page');
});
router.get('/register-page', function(req, res, next) {
  res.render('authentication/register-page');
});
router.get('/forgot-password-page', function(req, res, next) {
  res.render('authentication/forgot-password-page');
});



router.get('/tables', async function(req, res, next) {
  const posts = await Post.find()

  res.render('test/table',{posts} );
});

module.exports = router;

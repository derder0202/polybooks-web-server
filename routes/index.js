var express = require('express');
const {Post} = require("../api_src/model/model");
const authenticationController = require("../controllers/authentication_controller");
const passport = require("passport");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();

/* GET home page. */
router.get('/',authenticationController.formLogin)
router.post('/login',
    passport.authenticate('local', { successRedirect: '/Statistical',
      failureRedirect: '/Login' ,
    }));


router.post('/logout', (req, res)=> {
    req.session.destroy(function (err) {
        res.redirect('/Login'); //Inside a callback… bulletproof!
    });
});

// router.get('/admin_account_info', function(req, res, next) {
//   res.render('admin_account/admin_account_info');
// });

/* Authentication */

// router.get('/login-page', function(req, res, next) {
//   res.render('authentication/login-page');
// });
router.get('/register-page', function(req, res, next) {
  res.render('authentication/register-page');
});
router.get('/forgot-password-page', function(req, res, next) {
  res.render('authentication/forgot-password-page');
});




module.exports = router;

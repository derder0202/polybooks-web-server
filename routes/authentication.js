var express = require('express');
const authenticationController = require("../controllers/authentication_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();

router.get('/',(req,res)=>{
    var failureFlash = req.flash('error');
    console.log(failureFlash)
    res.render('authentication/login-page',{failureFlash})
})


module.exports = router;
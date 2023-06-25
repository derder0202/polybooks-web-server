var express = require('express');
const authenticationController = require("../controllers/authentication_controller");
var router = express.Router();


router.get('/',authenticationController.formLogin)


module.exports = router;
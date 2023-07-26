var express = require('express');
const authenticationController = require("../controllers/authentication_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();

// router.get('/',checkAuth,authenticationController.formLogin)


module.exports = router;
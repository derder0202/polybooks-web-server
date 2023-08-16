var express = require('express');
const accountbanController = require("../controllers/account_has_been_locked");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();

router.get('/',checkAuth,accountbanController.listAccountHasBeenLocked)



module.exports = router;
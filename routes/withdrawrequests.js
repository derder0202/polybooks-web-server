var express = require('express');
const withdrawRequestsController = require("../controllers/withdrawrequests_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();

router.get('/',checkAuth,withdrawRequestsController.listWithdrawRequest)

module.exports = router;
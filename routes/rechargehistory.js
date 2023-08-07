var express = require('express');
const depositHistoryController = require("../controllers/recharge_history_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();

router.get('/',checkAuth,depositHistoryController.listdepositHistory)

module.exports = router;
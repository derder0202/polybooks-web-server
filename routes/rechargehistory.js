var express = require('express');
const depositHistoryController = require("../controllers/recharge_history_controller");
var router = express.Router();

router.get('/',depositHistoryController.listdepositHistory)

module.exports = router;
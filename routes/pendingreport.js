var express = require('express');
const pendingReportController = require("../controllers/pending_report_controller");
var router = express.Router();


router.get('/',pendingReportController.listPendingReport)

module.exports = router;
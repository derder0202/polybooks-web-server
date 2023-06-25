var express = require('express');
const processedReportController = require("../controllers/processed_report_controller");
var router = express.Router();


router.get('/',processedReportController.listprocessedReport)

module.exports = router;
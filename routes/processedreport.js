var express = require('express');
const processedReportController = require("../controllers/processed_report_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();


router.get('/',checkAuth,processedReportController.listprocessedReport)

module.exports = router;
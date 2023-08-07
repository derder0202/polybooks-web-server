var express = require('express');
const checkAuth = require("../api_src/middleware/checkAuth");
const pendingReportController = require("../controllers/pending_report_controller");
var router = express.Router();


router.get('/',checkAuth,pendingReportController.listPendingReport)
router.get('/detail_report/:id',checkAuth,pendingReportController.detailReport)
router.post('/detail_report/:id',checkAuth,pendingReportController.replyfeedbackReport)


module.exports = router;
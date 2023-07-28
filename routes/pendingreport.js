var express = require('express');
const pendingReportController = require("../controllers/pending_report_controller");
var router = express.Router();


router.get('/',pendingReportController.listPendingReport)
router.get('/detail_report/:id',pendingReportController.detailReport)
router.post('/detail_report/:id',pendingReportController.replyfeedbackReport)


module.exports = router;
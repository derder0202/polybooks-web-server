var express = require('express');
const autionApprovalController = require("../controllers/aution_approval_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();

router.get('/',checkAuth,autionApprovalController.listAutionApproval); //duyệt bài đấu giá

router.get('/detail_aution/:id',checkAuth,autionApprovalController.detailAution); //chi tiết duyệt bài đấu giá
router.post('/detail_aution/:id',checkAuth,autionApprovalController.browseAuction);

module.exports = router;

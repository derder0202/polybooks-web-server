var express = require('express');
const autionApprovalController = require("../controllers/aution_approval_controller");
var router = express.Router();

router.get('/',autionApprovalController.listAutionApproval); //duyệt bài đấu giá

// router.get('/detail_aution_approval/:id',autionApprovalController.detailAutionApproval); //chi tiết duyệt bài đấu giá

module.exports = router;
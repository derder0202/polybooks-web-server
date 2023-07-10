var express = require('express');
const autionApprovalController = require("../controllers/aution_approval_controller");
var router = express.Router();

router.get('/',autionApprovalController.listAutionApproval); //duyệt bài đấu giá

router.get('/detail_aution/:id',autionApprovalController.detailAution); //chi tiết duyệt bài đấu giá
router.post('/detail_aution/:id',autionApprovalController.browseAuction);

module.exports = router;

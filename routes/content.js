var express = require('express');
const contentController = require("../controllers/content_controller");
var router = express.Router();


router.get('/',contentController.listContent);
// router.get('/aution_approval',contentController.listAutionApproval); //duyệt bài đấu giá
//
// router.get('/aution_approval/detail_aution_approval/:id',contentController.detailAutionApproval); //chi tiết duyệt bài đấu giá

module.exports = router;
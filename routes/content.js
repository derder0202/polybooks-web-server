var express = require('express');
const contentController = require("../controllers/content_controller");
var router = express.Router();


router.get('/',contentController.listContent);

router.get('/detail_aution_approval/:id',contentController.detailAutionApproval);
router.post('/detail_aution_approval/:id', contentController.approveAution); 


module.exports = router;

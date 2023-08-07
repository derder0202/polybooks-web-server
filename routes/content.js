var express = require('express');
const contentController = require("../controllers/content_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();


router.get('/',checkAuth,contentController.listContent);

router.get('/detail_aution_approval/:id',checkAuth,contentController.detailAutionApproval);
router.post('/detail_aution_approval/:id',checkAuth,contentController.approveAution); 


module.exports = router;

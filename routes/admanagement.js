var express = require('express');
const adManagementController = require("../controllers/ad_management_controller");
var router = express.Router();

router.get('/',adManagementController.listManagement)
router.get('/banner_details',adManagementController.detailManagement)


module.exports = router;
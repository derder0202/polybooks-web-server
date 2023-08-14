var express = require('express');
const {adManagementController,upload} = require("../controllers/ad_management_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();


router.get('/',checkAuth,adManagementController.listBannerManagement);

// router.get('/edit_banner/:id',adManagementController.editBannerManagement);
// router.post('/edit_banner/:id',adManagementController.postEditBanner);
router.get('/banner_details/:id',checkAuth,adManagementController.detailBanner);

router.get('/add_new_banner',checkAuth,adManagementController.getformbanner);
router.post('/add_new_banner',checkAuth,upload,adManagementController.postAddBanner);

module.exports = router;
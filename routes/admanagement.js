var express = require('express');
const {adManagementController,upload} = require("../controllers/ad_management_controller");

var router = express.Router();


router.get('/',adManagementController.listBannerManagement);

// router.get('/edit_banner/:id',adManagementController.editBannerManagement);
// router.post('/edit_banner/:id',adManagementController.postEditBanner);
router.get('/banner_details/:id',adManagementController.detailBanner);

router.get('/add_new_banner',adManagementController.getformbanner);
router.post('/add_new_banner',upload,adManagementController.postAddBanner);

module.exports = router;
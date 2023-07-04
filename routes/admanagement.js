var express = require('express');
const adManagementController = require("../controllers/ad_management_controller");
var router = express.Router();

router.get('/',adManagementController.listBannerManagement);

router.get('/edit_banner/:id',adManagementController.editBannerManagement);
router.post('/edit_banner/:id',adManagementController.postEditBanner);

router.get('/add_new_banner',adManagementController.formAddNewBanner);
router.post('/add_new_banner',adManagementController.postAddNewBanner);


module.exports = router;
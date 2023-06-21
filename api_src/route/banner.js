const express = require("express");
const router = express.Router();
const bannerController = require("../controller/banner_controller");
 router.get("/", bannerController.getBanners);
router.get("/:id", bannerController.getBannerById);
router.post("/", bannerController.createBanner);
router.put("/:id", bannerController.updateBannerById);
router.delete("/:id", bannerController.deleteBannerById);
 module.exports = router;
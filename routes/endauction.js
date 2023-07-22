var express = require('express');
const endAuctionController = require("../controllers/endauction_controller");
var router = express.Router();


router.get('/',endAuctionController.listEndAuction)



module.exports = router;
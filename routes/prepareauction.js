var express = require('express');
const prepareAuctionController = require("../controllers/prepareauction_controller");
var router = express.Router();


router.get('/',prepareAuctionController.listPrepareAuction)



module.exports = router;
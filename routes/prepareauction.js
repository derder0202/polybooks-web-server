var express = require('express');
const prepareAuctionController = require("../controllers/prepareauction_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();


router.get('/',checkAuth,prepareAuctionController.listPrepareAuction)



module.exports = router;
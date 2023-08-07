var express = require('express');
const endAuctionController = require("../controllers/endauction_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();


router.get('/',checkAuth,endAuctionController.listEndAuction)



module.exports = router;
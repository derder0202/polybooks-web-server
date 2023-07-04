var express = require('express');
const statisticalController = require("../controllers/statistical_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();


router.get('/',statisticalController.liststatistical)

module.exports = router;
var express = require('express');
const statisticalController = require("../controllers/statistical_controller");
var router = express.Router();


router.get('/',statisticalController.liststatistical)

module.exports = router;
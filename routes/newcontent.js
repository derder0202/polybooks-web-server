var express = require('express');
const newcontentController = require("../controllers/newcontent_controller");
var router = express.Router();


router.get('/',newcontentController.listNewContent)

module.exports = router;
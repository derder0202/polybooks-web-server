var express = require('express');
const contentController = require("../controllers/content_controller");
var router = express.Router();


router.get('/',contentController.listContent)

module.exports = router;
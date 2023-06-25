var express = require('express');
const autionpostController = require("../controllers/aution_post_controller");
var router = express.Router();

router.get('/',autionpostController.listAutionpost)


module.exports = router;
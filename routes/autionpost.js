var express = require('express');
const autionpostController = require("../controllers/aution_post_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();

router.get('/',checkAuth,autionpostController.listAutionApproval)


module.exports = router;
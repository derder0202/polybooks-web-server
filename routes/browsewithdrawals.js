var express = require('express');
const browsewithdrawalsController = require("../controllers/browsewithdrawals_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();

router.get('/',checkAuth,browsewithdrawalsController.listBrowsewithdrawals)

router.get('/detailbrowsewithdrawals/:id',checkAuth,browsewithdrawalsController.detailBrowsewithdrawal)
router.post('/detailbrowsewithdrawals/:id',checkAuth,browsewithdrawalsController.replyWithdraws)

module.exports = router;
var express = require('express');
const accountbanController = require("../controllers/account_has_been_locked");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();

router.get('/',checkAuth,accountbanController.listAccountHasBeenLocked)

router.get('/unban_account/:id',checkAuth,accountbanController.formunbanAcc)
router.post('/unban_account/:id',checkAuth,accountbanController.unbanAccountMember)



module.exports = router;
var express = require('express');
const vipMembersController = require("../controllers/vip_member_controller");
var router = express.Router();

router.get('/',vipMembersController.listVipMembers)

module.exports = router;
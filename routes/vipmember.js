var express = require('express');
const vipMembersController = require("../controllers/vip_member_controller");
var router = express.Router();

router.get('/',vipMembersController.listVipMembers)

router.get('/edit_vip_member/:id',vipMembersController.formEditVipMember)
router.post('/edit_vip_member/:id',vipMembersController.postEditVipMember)

module.exports = router;
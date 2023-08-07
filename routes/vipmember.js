var express = require('express');
const vipMembersController = require("../controllers/vip_member_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();

router.get('/',checkAuth,vipMembersController.listVipMembers)

router.get('/edit_vip_member/:id',checkAuth,vipMembersController.formEditVipMember)
router.post('/edit_vip_member/:id',checkAuth,vipMembersController.postEditVipMember)

module.exports = router;
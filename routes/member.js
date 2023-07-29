var express = require('express');
const memberController = require("../controllers/regular_member_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();

//hiển thị list user
router.get('/',memberController.listRegularMember)

//Sửa thông tin user
router.get('/edit_regular_member/:id',memberController.formEditRegularMember)
router.post('/edit_regular_member/:id',memberController.postEditRegularMember)



router.get('/add_regular_member',memberController.formAddRegularMember)
router.post('/add_regular_member',memberController.addRegularMember)

router.delete('/:id',memberController.addRegularMember)


router.get('/change_password',memberController.formChangePassword)

// polybooks.store/members/regular
module.exports = router;

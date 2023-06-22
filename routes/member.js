var express = require('express');
const memberController = require("../controllers/regular_member_controller");
var router = express.Router();

/* GET users listing. */
// router.get('/',async function(req, res, next) {
//   const users = await User.find()
//   res.render('test/table',{users})
// });

router.get('/',memberController.listRegularMember)

router.post('/',memberController.addRegularMember)

router.put('/:id',memberController.addRegularMember) // nho sua lai

router.delete('/:id',memberController.addRegularMember)


// polybooks.store/members/regular
module.exports = router;

var express = require('express');
const {User} = require("../api_src/model/model");
var router = express.Router();

/* GET users listing. */
// router.get('/',async function(req, res, next) {
//   const users = await User.find()
//   res.render('test/table',{users})
// });

router.get('/listUsers')


module.exports = router;

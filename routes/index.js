var express = require('express');
const {User} = require("../api_src/model/model");
var router = express.Router();

/* GET home page. */
router.get('/',  async function(req, res, next) {
  const users = await User.find()
  res.render('index', {
    title: 'hasifhasifh',
     users
    // users: users
  });
});

module.exports = router;

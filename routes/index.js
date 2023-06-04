var express = require('express');
const {Post} = require("../api_src/model/model");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/tables', async function(req, res, next) {
  const posts = await Post.find()

  res.render('test/table',{posts} );
});

module.exports = router;

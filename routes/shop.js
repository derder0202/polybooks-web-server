var express = require('express');
const shopController = require("../controllers/shop_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();

router.get('/',checkAuth,shopController.listShop)
router.get('/add_shop', shopController.listUser);

router.get('/edit_shop/:id',checkAuth,shopController.formEditShop)
router.post('/edit_shop/:id',checkAuth,shopController.postEditShop)

router.get('/delete_shop/:id',checkAuth,shopController.formDeletaShop)
router.post('/delete_shop/:id',checkAuth,shopController.PostDeleteShop)

router.get('/add_shop',checkAuth,shopController.formAddShop)
router.post('/add_shop',checkAuth,shopController.addShop)
module.exports = router;
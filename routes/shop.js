var express = require('express');
const shopController = require("../controllers/shop_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
var router = express.Router();

router.get('/',shopController.listShop)
router.get('/add_shop', shopController.listUser);

router.get('/edit_shop/:id',shopController.formEditShop)
router.post('/edit_shop/:id',shopController.postEditShop)

router.get('/delete_shop/:id',shopController.formDeletaShop)
router.post('/delete_shop/:id',shopController.PostDeleteShop)

router.get('/add_shop',shopController.formAddShop)
router.post('/add_shop',shopController.addShop)
module.exports = router;
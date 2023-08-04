const {Shop,User} = require("../api_src/model/model");

const shopController = {
    listShop : async (req,res)=>{
        try {
            const listShops = await Shop.find();
            res.render('shop/list_shop', { listShops});
        } catch (error) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách shop');
        }
    },
    listUser : async (req,res)=>{
        try {
            const listUser = await User.find({}, '_id fullName');
            res.render('shop/add_shop', { listUser});
        } catch (error) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách');
        }
    },
    formEditShop: async (req,res)=>{
        console.log(req.params)
        let itemShop = await Shop.findById(req.params.id)
            .exec()
            .catch(function (err){
                console.log(err);
            });
        console.log(itemShop)
        if (itemShop == null){
            res.send('Không tìm thấy bản ghi');
        }
        res.render('shop/edit_shop',{itemShop});
    },
    postEditShop: async (req,res)=>{
        try {
            console.log(req.body);
            const dieu_kien = {
              _id: req.params.id
            };
            const du_lieu = {
              name: req.body.shop_name,
              phone1: req.body.shop_phone,
              phone2: req.body.phone_shop,
              description: req.body.shop_description,
              address: req.body.shop_address,
            };
        
            await Shop.updateOne(dieu_kien, du_lieu);
            res.redirect('/Shop');
          } catch (error) {
            res.send("Lỗi cập nhật: " + error.message);
          }
    },
    formDeletaShop: async (req,res)=>{
    console.log(req.params)
    let itemShop = await Shop.findById(req.params.id)
            .exec()
            .catch(function (err){
                console.log(err);
            });
        console.log(itemShop)
        if (itemShop == null){
            res.send('Không tìm thấy bản ghi');
    }
        res.render('shop/delete_shop',{itemShop})
    },
    PostDeleteShop: async (req, res) => {
        let dieu_kien = {
          _id: req.params.id
        };
      
        try {
          await Shop.deleteOne(dieu_kien);
          console.log('Xóa thành công');
        } catch (err) {
          console.log(err);
        }
      
        res.redirect('/Shop');
    },
    formAddShop: async (req,res)=>{
        res.render('shop/add_shop');
    },
    addShop: async (req,res)=>{
        try {
        const name = req.body.inputShopname;
        const user = req.body.inputUser;
        const phone1 = req.body.ShopPhoneNumber;
        const phone2 = req.body.ShopPhone;
        const description = req.body.description;
        const address = req.body.address;   

        const newShop = new Shop({
            name,
            user,
            phone1,
            phone2,
            description,
            address
        });
        await newShop.save();
        res.redirect('/Shop');
    } catch (error) {
        res.send("Lỗi khi thêm người dùng: " + error.message);
        }
    }

}

module.exports = shopController
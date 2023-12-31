const {Shop,User,Report,WithdrawRequest,Post} = require("../api_src/model/model");
const admin = require('firebase-admin');
const shopController = {
    listShop : async (req,res)=>{
        try {
            const listShops = await Shop.find().populate("user");
            const userName = req.user.fullName;
            const userEmail = req.user.email;
            const listBook = await Post.find({postStatus : 0});
            const listReport = await Report.find({status : 0});
            const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
            const db = admin.firestore();
            const documentList = [];
            const snapshot = await db.collection("PostAuction").where("auctionType","==",0).get();
            snapshot.forEach((doc) => {
            documentList.push({_id:doc.id,...doc.data()});
            });
            const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length + documentList.length;
            res.render('shop/list_shop', {
                partials: {
                    nav_header: 'partials/nav_header'
                },
                listShops,
                documentList,
                userName,
                userEmail,
                listBook,
                totalItemCount,
                listBrowsewithdrawals,
                listReport,
            });
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
        const listBook = await Post.find({postStatus : 0});
        const listReport = await Report.find({status : 0});
        const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
        const db = admin.firestore();
        const documentList = [];
        const snapshot = await db.collection("PostAuction").where("auctionType","==",0).get();
        snapshot.forEach((doc) => {
        documentList.push({_id:doc.id,...doc.data()});
        });
        const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length + documentList.length;
        const userName = req.user.fullName;
        const userEmail = req.user.email;
        res.render('shop/edit_shop',{
            partials: {
                nav_header: 'partials/nav_header'
            },
            itemShop,
            userName,
            documentList,
            userEmail,
            listBook,
            totalItemCount,
            listBrowsewithdrawals,
            listReport,
        });
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
    formAddShop: async (req,res)=> {
        const userName = req.user.fullName;
        const userEmail = req.user.email;
        res.render('shop/add_shop',{ 
            partials: {
                nav_header: 'partials/nav_header'
            },
            userName,
            userEmail,
        });
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
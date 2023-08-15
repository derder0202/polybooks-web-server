const {User,Post,Report,WithdrawRequest} = require("../api_src/model/model");
const admin = require('firebase-admin');
const vipMembersController = {
    listVipMembers: async (req,res)=>{
        try {
            const listUsersVip = await User.find({role : 1});
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
            res.render('vip_member/list_vip_member',{
                partials: {
                    nav_header: 'partials/nav_header'
                },
                listUsersVip,
                userName,
                documentList,
                userEmail,
                listBook,
                totalItemCount,
                listBrowsewithdrawals,
                listReport,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách người dùng');
        }
    },
    formEditVipMember: async (req,res)=>{
        console.log(req.params)
        let itemVipMember = await User.findById(req.params.id).populate('address')
            .exec()
            .catch(function (err){
                console.log(err);
            });
        console.log(itemVipMember)
        if (itemVipMember == null){
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
        res.render('vip_member/edit_vip_member',{
            partials: {
                nav_header: 'partials/nav_header'
            },
            itemVipMember,
            documentList,
            userName,
            userEmail,
            listBook,
            totalItemCount,
            listBrowsewithdrawals,
            listReport,
        });
    },
    postEditVipMember: async (req,res)=>{
        try {
            console.log(req.body);
            const dieu_kien = {
              _id: req.params.id
            };
            const du_lieu = {
              fullName: req.body.member_name,
              email: req.body.member_email,
              role: Number(req.body.member_role),
              gender: req.body.member_gender,
            //   address: req.body.member_address,
            //   birthday: new Date(req.body.member_birthday)
            };
        
            await User.updateOne(dieu_kien, du_lieu);
            res.redirect('/VipMembers');
        } catch (error) {
            res.send("Lỗi cập nhật: " + error.message);
          }
    },
    formbanAccVip: async (req,res)=>{
        let itemUser = await User.findById(req.params.id)
                .exec()
                .catch(function (err){
                    console.log(err);
                });
            if (itemUser == null){
                res.send('Không tìm thấy bản ghi');
        }
            res.render('vip_member/ban_account_vip',{itemUser})
    },
    banAccountVip:async (req, res) => {
        try {
            const unActiveAccount = await User.findByIdAndUpdate(req.params.id,{active:false},{new:true})
            if(!unActiveAccount){
                return res.status(400).json({message: "User not found"})
            }
            await Post.updateMany({seller:unActiveAccount._id},{postStatus:"11"})
            res.redirect('/VipMembers');
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error })
        }
    },
}

module.exports = vipMembersController
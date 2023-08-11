const {User,Post,Report,WithdrawRequest} = require("../api_src/model/model");

const vipMembersController = {
    listVipMembers: async (req,res)=>{
        try {
            const listUsersVip = await User.find({role : 1});
            const listBook = await Post.find({postStatus : 0});
            const listReport = await Report.find({status : 0});
            const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
            const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length;
            const userName = req.user.fullName;
            const userEmail = req.user.email;
            res.render('vip_member/list_vip_member',{
                partials: {
                    nav_header: 'partials/nav_header'
                },
                listUsersVip,
                userName,
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
        const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length;
        const userName = req.user.fullName;
        const userEmail = req.user.email;
        res.render('vip_member/edit_vip_member',{
            partials: {
                nav_header: 'partials/nav_header'
            },
            itemVipMember,
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
}

module.exports = vipMembersController
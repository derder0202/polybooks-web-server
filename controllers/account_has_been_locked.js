const {User,Post,WithdrawRequest,Report} = require("../api_src/model/model");
const admin = require('firebase-admin');
const accountbanController = {
    //Hiển thị toàn bộ list user
    listAccountHasBeenLocked: async (req,res)=>{
        try {
            const listAccountBan = await User.find({active: false}).populate('address');
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
            res.render('account_has_been_locked/list_user_locked', {
                partials: {
                    nav_header: 'partials/nav_header'
                },
                listAccountBan,
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
            res.status(500).send('Lỗi khi lấy danh sách người dùng');
        }
    },
}

module.exports = accountbanController
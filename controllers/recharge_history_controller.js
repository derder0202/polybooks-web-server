const {DepositHistory,Post,Report,WithdrawRequest} = require("../api_src/model/model");
const User = require("../api_src/model/model").User;
const admin = require('firebase-admin');
const depositHistoryController = {
    listdepositHistory : async (req,res)=>{
        try {
            const listdepositHistorys = await DepositHistory.find().populate('userId');
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
            res.render('deposit_history/deposit_history',{
                partials: {
                    nav_header: 'partials/nav_header'
                },
                listdepositHistorys,
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
            res.status(500).send('Lỗi khi lấy danh sách nạp tiền');
        }
    },
}
module.exports = depositHistoryController

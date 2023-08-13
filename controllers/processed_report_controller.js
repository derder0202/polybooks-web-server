const {Report,Post,WithdrawRequest} = require("../api_src/model/model");
const User = require("../api_src/model/model").User;
const admin = require('firebase-admin');
const processedReportController = {
    listprocessedReport: async (req,res)=>{
        try {
            const listprocessedReport = await Report.find({status : 1}).populate('userId');
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
            res.render('report/processed_report',{
                partials: {
                    nav_header: 'partials/nav_header'
                },
                listprocessedReport,
                userName,
                documentList,
                userEmail,
                listBook,
                totalItemCount,
                listBrowsewithdrawals,
                listReport,
            });
        }catch (e) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách report');
        }
    },
}
module.exports = processedReportController
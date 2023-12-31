const {Report,Post,WithdrawRequest} = require("../api_src/model/model");
const User = require("../api_src/model/model").User;
const admin = require('firebase-admin');
const moment = require('moment');
const pendingReportController = {
    listPendingReport: async (req,res)=>{
        try {
            const listReport = await Report.find({status : 0}).populate('userId');
            const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
            const listBook = await Post.find({postStatus : 0});
            const db = admin.firestore();
            const documentList = [];
            const snapshot = await db.collection("PostAuction").where("auctionType","==",0).get();
            snapshot.forEach((doc) => {
            documentList.push({_id:doc.id,...doc.data()});
            });
            const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length + documentList.length;
            const userName = req.user.fullName;
            const userEmail = req.user.email;
            res.render('report/pending_report',{
                partials: {
                    nav_header: 'partials/nav_header'
                },
                listReport,
                documentList,
                userName,
                userEmail,
                listBook,
                totalItemCount,
                listBrowsewithdrawals
            });
        }catch (e) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách report');
        }
    },
    detailReport: async (req,res)=>{
        let detailReports = await Report.findById(req.params.id).populate('userId')
            .exec()
            .catch(function (err) {
                console.log(err)
            });
        console.log(detailReports)
        if (detailReports == null){
            res.send('Không tìm thấy bản ghi');
        }
        const listReport = await Report.find({status : 0}).populate('userId');
        const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
        const listBook = await Post.find({postStatus : 0});
        const db = admin.firestore();
        const documentList = [];
        const snapshot = await db.collection("PostAuction").where("auctionType","==",0).get();
        snapshot.forEach((doc) => {
        documentList.push({_id:doc.id,...doc.data()});
        });
        const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length + documentList.length;
        const userName = req.user.fullName;
        const userEmail = req.user.email;
        res.render('report/detail_report',{
            partials: {
                nav_header: 'partials/nav_header'
            },
            detailReports,
            documentList,
            userName,
            userEmail,
            listBook,
            totalItemCount,
            listBrowsewithdrawals,
            listReport,
        });
    },
    replyfeedbackReport: async(req,res)=>{
        try {
            const detailReports = await Report.findById(req.params.id);
        
        if (!detailReports) {
            return res.send('Không tìm thấy bản ghi');
        }
        
        if (req.body.action === 'reply') {
            detailReports.status = 1;
            detailReports.replyReport = req.body.replyReport;
            const updatedTime = moment().add(1, 'minute');
            detailReports.updatedAt = updatedTime.toDate();
        } else if (req.body.action === 'noreply') {
            detailReports.status = 3;
        }
        
        await detailReports.save();
        
        console.log('Thông tin được thay đổi:', detailReports);
        res.redirect('/PendingReport');
        } catch (err) {
            console.error(err);
            res.status(500).send('Đã xảy ra lỗi server');
        }
    }
}
module.exports = pendingReportController
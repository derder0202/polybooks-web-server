
const { config } = require("dotenv");
const {User, Post, Bill, Shop,Report,WithdrawRequest} = require("../api_src/model/model");
const admin = require('firebase-admin');
const statisticalController = {
    liststatistical: async (req,res)=>{
    let urls = require("../config_url")
    const categoryCounts = await Bill.countByCategory();

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
    
    // const filteredCategoryCounts = categoryCounts.filter(item => item.count >= 5);   //categoryCounts: filteredCategoryCounts, 
    const userName = req.user.fullName;
    const userEmail = req.user.email;
    res.render('statistical/account_statistics',{
        partials: {
            nav_header: 'partials/nav_header'
        },
        categoryCounts, 

        listBook,
        totalItemCount,
        listBrowsewithdrawals,
        listReport,
        documentList,
        urls,
        userName,
        userEmail
    });   
},

}
module.exports = statisticalController
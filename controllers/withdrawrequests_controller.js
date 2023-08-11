const {WithdrawRequest,Post,Report} = require("../api_src/model/model");
const User = require("../api_src/model/model").User;

const withdrawRequestsController = {
    listWithdrawRequest : async (req,res)=>{
        try {
            const listWithdrawRequests = await WithdrawRequest.find({status : 1}).populate('userId');
            const listBook = await Post.find({postStatus : 0});
            const listReport = await Report.find({status : 0});
            const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
            const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length;
            const userName = req.user.fullName;
            const userEmail = req.user.email;
            res.render('withdrawrequests/withdrawrequests',{
                partials: {
                    nav_header: 'partials/nav_header'
                },
                listWithdrawRequests,
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
}
module.exports = withdrawRequestsController

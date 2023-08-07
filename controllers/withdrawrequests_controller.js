const WithdrawRequest = require("../api_src/model/model").WithdrawRequest;
const User = require("../api_src/model/model").User;

const withdrawRequestsController = {
    listWithdrawRequest : async (req,res)=>{
        try {
            const listWithdrawRequests = await WithdrawRequest.find({status : 1}).populate('userId');
            const userName = req.user.fullName;
            const userEmail = req.user.email;
            res.render('withdrawrequests/withdrawrequests',{
                partials: {
                    nav_header: 'partials/nav_header'
                },
                listWithdrawRequests,
                userName,
                userEmail
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách shop');
        }
    },
}
module.exports = withdrawRequestsController

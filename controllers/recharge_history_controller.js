const DepositHistory = require("../api_src/model/model").DepositHistory;
const User = require("../api_src/model/model").User;

const depositHistoryController = {
    listdepositHistory : async (req,res)=>{
        try {
            const listdepositHistorys = await DepositHistory.find().populate('userId');
            const userName = req.user.fullName;
            const userEmail = req.user.email;
            res.render('deposit_history/deposit_history',{
                partials: {
                    nav_header: 'partials/nav_header'
                },
                listdepositHistorys,
                userName,
                userEmail
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách shop');
        }
    },
}
module.exports = depositHistoryController

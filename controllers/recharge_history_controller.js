const DepositHistory = require("../api_src/model/model").DepositHistory;
const User = require("../api_src/model/model").User;

const depositHistoryController = {
    listdepositHistory : async (req,res)=>{
        
        try {
            const listdepositHistorys = await DepositHistory.find().populate('userId');
            res.render('deposit_history/deposit_history',{listdepositHistorys});
        } catch (error) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách shop');
        }
    },
}
module.exports = depositHistoryController

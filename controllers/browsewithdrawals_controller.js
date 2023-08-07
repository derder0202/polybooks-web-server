const WithdrawRequest = require("../api_src/model/model").WithdrawRequest;
const User = require("../api_src/model/model").User;

const browsewithdrawalsController = {
    listBrowsewithdrawals : async (req,res)=>{
        try {
            const listBrowsewithdrawals = await WithdrawRequest.find({status: 0}).populate('userId');
            const userName = req.user.fullName;
            const userEmail = req.user.email;
            res.render('browsewithdrawals/browsewithdrawals',{
                partials: {
                    nav_header: 'partials/nav_header'
                },
                listBrowsewithdrawals,
                userName,
                userEmail
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách shop');
        }
    },
    detailBrowsewithdrawal: async (req,res) =>{
        let detailBrowsewithdrawals = await WithdrawRequest.findById(req.params.id).populate('userId')
            .exec()
            .catch(function (err) {
                console.log(err)
            });
        if (detailBrowsewithdrawals == null){
            res.send('Không tìm thấy bản ghi');
        }
        const userName = req.user.fullName;
        const userEmail = req.user.email;
        res.render('browsewithdrawals/detailbrowsewithdrawals',{
          partials: {
            nav_header: 'partials/nav_header'
          },
          detailBrowsewithdrawals,
          userName,
          userEmail
        })
    },
    replyWithdraws: async(req,res)=>{
        try {
            const detailBrowsewithdrawals = await WithdrawRequest.findById(req.params.id);
        
        if (!detailBrowsewithdrawals) {
            return res.send('Không tìm thấy bản ghi');
        }
        
        if (req.body.action === 'replys') {
            detailBrowsewithdrawals.status = 1;
        } else if (req.body.action === 'noreplys') {
            detailBrowsewithdrawals.status = 3;
            detailBrowsewithdrawals.replywithdraw = req.body.replywithdraw;
        }
        
        await detailBrowsewithdrawals.save();
        
        console.log('Thông tin được thay đổi:', detailBrowsewithdrawals);
        res.redirect('/BrowseWithdrawals');
        } catch (err) {
            console.error(err);
            res.status(500).send('Đã xảy ra lỗi server');
        }
    }
}
module.exports = browsewithdrawalsController

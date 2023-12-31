var express = require('express');
const statisticalController = require("../controllers/statistical_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
const {User, Post, Bill,Shop,DepositHistory} = require("../api_src/model/model");
var router = express.Router();
const admin = require('firebase-admin');


router.get('/',checkAuth,statisticalController.liststatistical)

router.get('/getVipUser',async(req,res)=>{
    //const totalUsers = await User.countDocuments();
    const regularUsers = await User.countDocuments({ role: '0' });
    const vipUsers = await User.countDocuments({ role: '1' });
    const regularUserPercentage = Math.round((regularUsers / (regularUsers+vipUsers)) * 100);
    const vipUserPercentage = Math.round((vipUsers / (regularUsers+vipUsers)) * 100);
    res.json({regularUserPercentage, vipUserPercentage,regularUsers,vipUsers})
})
router.get('/newUser',async(req,res)=>{
    let statisticalToday = {}
    let statisticalWeek = {}
    let statisticalMonth = {}
        // Count new users for today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
    const todayCountUser = await User.countDocuments({ createdAt: { $gte: today } }); // so user duoc tao hom nay
    statisticalToday.userToday = todayCountUser
        // Count new users for the past 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysCountUser = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }); //so user duoc tao 7 ngay
    statisticalWeek.userWeek = sevenDaysCountUser
        // Count new users for the past 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysCountUser = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    statisticalMonth.userMonth = thirtyDaysCountUser

    //Shop
    const todayCountShop = await Shop.countDocuments({createdAt: { $gte: today } });
    statisticalToday.shopToday = todayCountShop;

    const sevenDaysCountShop = await Shop.countDocuments({ createdAt: { $gte: sevenDaysAgo } }); 
    statisticalWeek.shopWeek = sevenDaysCountShop;

    const thirtyDaysCountShop = await Shop.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }); 
    statisticalMonth.shopMonth = thirtyDaysCountShop;

    //Tiền nạp
    const todayTotalDepositAmount = await DepositHistory.aggregate([
        {
          $match: { createdAt: { $gte: today } }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$depositAmount" }
          }
        }
      ]);
      
      statisticalToday.DepositHistoryToday = todayTotalDepositAmount.length > 0 ? todayTotalDepositAmount[0].totalAmount : 0;
      
      const sevenDaysTotalDepositAmount = await DepositHistory.aggregate([
        {
          $match: { createdAt: { $gte: sevenDaysAgo } }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$depositAmount" }
          }
        }
      ]);
      
      statisticalWeek.DepositHistoryWeek = sevenDaysTotalDepositAmount.length > 0 ? sevenDaysTotalDepositAmount[0].totalAmount : 0;
      
      const thirtyDaysTotalDepositAmount = await DepositHistory.aggregate([
        {
          $match: { createdAt: { $gte: thirtyDaysAgo } }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$depositAmount" }
          }
        }
      ]);
      
      statisticalMonth.DepositHistoryMonth = thirtyDaysTotalDepositAmount.length > 0 ? thirtyDaysTotalDepositAmount[0].totalAmount : 0;
      

    //Post
    const todayCountPost = await Post.countDocuments({ createdAt: { $gte: today }, postStatus: { $gte: 1 } });
    statisticalToday.postToday = todayCountPost;
    // Count new posts for the past 7 days
    const sevenDaysCountPost = await Post.countDocuments({ createdAt: { $gte: sevenDaysAgo }, postStatus: { $gte: 1 } });
    statisticalWeek.postWeek = sevenDaysCountPost;
    // Count new posts for the past 30 days
    const thirtyDaysCountPost = await Post.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, postStatus: { $gte: 1 } });
    statisticalMonth.postMonth = thirtyDaysCountPost;
    
    //Send Bill
    const todaySendBills = await Bill.countDocuments({ createdAt: { $gte: today }, status:{ $in: [0, 1, 2 ] } });
    statisticalToday.sendBillsToday = todaySendBills;
    const sevenDaysAgoSendBills = await Bill.countDocuments({ createdAt: { $gte: sevenDaysAgo },status:{ $in: [0, 1, 2] } });
    statisticalWeek.sendBillsWeek = sevenDaysAgoSendBills;
    const thirtyDaysAgoSendBills = await Bill.countDocuments({ createdAt: { $gte: thirtyDaysAgo },status:{ $in: [0, 1, 2] } });
    statisticalMonth.sendBillsMonth = thirtyDaysAgoSendBills;

    //Complete Bill
    const todayCompleteBills = await Bill.countDocuments({ createdAt: { $gte: today }, status:{ $in: [3 ] } });
    statisticalToday.completeBillsToday = todayCompleteBills;
    const sevenDaysAgoCompleteBills = await Bill.countDocuments({ createdAt: { $gte: sevenDaysAgo },status:{ $in: [3] } });
    statisticalWeek.completeBillsWeek = sevenDaysAgoCompleteBills;
    const thirtyDaysAgoCompleteBills = await Bill.countDocuments({ createdAt: { $gte: thirtyDaysAgo },status:{ $in: [3] } });
    statisticalMonth.completeBillsMonth = thirtyDaysAgoCompleteBills;
    
    res.json({statisticalToday, statisticalWeek,statisticalMonth})
})

router.get('/getRegularBookDataChart', async (req, res) => {
  //Đây là lấy list sách đăng bán
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6); // Ngày bắt đầu là 6 ngày trước hôm nay

    // Create an empty map to store the counts
    const dataThisWeekRegularTemplate = {};

    // Iterate over each day of the week
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
        const nextDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i + 1);

        // Count posts for the current day
        const postsCount = await Post.countDocuments({ createdAt: { $gte: currentDate, $lt: nextDate } });

        // Get the day name
        const dayName = currentDate.toLocaleDateString('vi-VN')

        // Save the count in the map
        dataThisWeekRegularTemplate[`${dayName}`] = postsCount;
    }

    
    let dataThisWeekRegular = {};
    dataThisWeekRegular.label = Object.keys(dataThisWeekRegularTemplate);
    dataThisWeekRegular.data = Object.values(dataThisWeekRegularTemplate);

    res.json(dataThisWeekRegular);
});
router.get('/getBillDataChart', async (req, res) => {
  //Đây là lấy list đơn gửi đi
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6); // Ngày bắt đầu là 6 ngày trước hôm nay

    // Create an empty map to store the counts
    const DataThisweekInvoiceSample = {};
        // Iterate over each day of the week
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
            const nextDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i + 1);

            // Count regular book orders for the current day with status 0, 1, or 2
            const ordersCount = await Bill.countDocuments({ createdAt: { $gte: currentDate, $lt: nextDate },status:{ $in: [0, 1, 2] } });

            // Get the day name
            const dayName = currentDate.toLocaleDateString('vi-VN');

            // Save the count in the map
            DataThisweekInvoiceSample[`${dayName}`] = ordersCount;
        }

        
        let dataThisWeekInvoi = {};
        dataThisWeekInvoi.label = Object.keys(DataThisweekInvoiceSample);
        dataThisWeekInvoi.data = Object.values(DataThisweekInvoiceSample);

    res.json(dataThisWeekInvoi);
});
router.get('/getBillThreeDataChart', async (req, res) => {
  //Đây là lấy list đơn hoàn thành
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6); // Ngày bắt đầu là 6 ngày trước hôm nay

    const DataThreeInvoiceSample = {};
        // Iterate over each day of the week
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
            const nextDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i + 1);

            // Count regular book orders for the current day with status 0, 1, or 2
            const ordersCount = await Bill.countDocuments({ createdAt: { $gte: currentDate, $lt: nextDate },status:{ $in: [3] } });

            // Get the day name
            const dayName = currentDate.toLocaleDateString('vi-VN');

            // Save the count in the map
            DataThreeInvoiceSample[`${dayName}`] = ordersCount;
        }

        
        let dataThisWeekThree = {};
        dataThisWeekThree.label = Object.keys(DataThreeInvoiceSample);
        dataThisWeekThree.data = Object.values(DataThreeInvoiceSample);

    res.json(dataThisWeekThree);
});


router.get('/getAuctionBookDataChart', async (req, res) => {
    // Đoạn mã xử lý lấy dữ liệu sách đấu giá
  

    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    // Create an empty map to store the counts
    const dataThisWeekAuctionTemplate = {};
    // Iterate over each day of the week
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
        const nextDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i + 1);
        // Count posts for the current day
        const postsRef = admin.firestore().collection('PostAuction');
        const query = postsRef
            .where('createdAt', '>=', currentDate.toISOString())
            .where('createdAt', '<', nextDate.toISOString());
        const snapshot = await query.get();
        const postsCount = snapshot.size;
        // Get the day name
        const dayName = currentDate.toLocaleDateString('vi-VN', )
        // Save the count in the map
        dataThisWeekAuctionTemplate[`${dayName}`] = postsCount;
    }
    
    let dataThisWeekAuction = {};
    dataThisWeekAuction.label = Object.keys(dataThisWeekAuctionTemplate);
    dataThisWeekAuction.data = Object.values(dataThisWeekAuctionTemplate);
    res.json(dataThisWeekAuction);
});

module.exports = router;
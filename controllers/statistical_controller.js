const {User, Post, Bill, Shop} = require("../api_src/model/model");
const statisticalController = {
    liststatistical: async (req,res)=>{
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
        
        // console.log(`New users for today: ${todayCountUser}`);
        // console.log(`New users for the past 7 days: ${sevenDaysCountUser}`);
        // console.log(`New users for the past 30 days: ${thirtyDaysCountUser}`);
        //làm tương tự với các model còn lại bao gồm Shop, Post, Bill(gửi đi và hoàn thành check status(

        //POST
        const todayCountPost = await Post.countDocuments({createAt: { $gte: today },postStatus:{$gte: 1}});
        statisticalToday.postToday = todayCountPost;

        const sevenDaysCountPost = await Post.countDocuments({ createdAt: { $gte: sevenDaysAgo },postStatus:{$gte: 1} }); //so user duoc tao 7 ngay
        statisticalWeek.postWeek = sevenDaysCountPost;

        const thirtyDaysCountPost = await Post.countDocuments({ createdAt: { $gte: thirtyDaysAgo },postStatus:{$gte: 1} }); //so user duoc tao 7 ngay
        statisticalMonth.postMonth = thirtyDaysCountPost;

        // console.log(`New posts for today: ${todayCountPost}`);
        // console.log(`New posts for the past 7 days: ${sevenDaysCountPost}`);
        // console.log(`New posts for the past 30 days: ${thirtyDaysCountPost}`);

        //Shop
        const todayCountShop = await Shop.countDocuments({createAt: { $gte: today } });
        statisticalToday.shopToday = todayCountShop;

        const sevenDaysCountShop = await Shop.countDocuments({ createdAt: { $gte: sevenDaysAgo } }); //so user duoc tao 7 ngay
        statisticalWeek.shopWeek = sevenDaysCountShop;

        const thirtyDaysCountShop = await Shop.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }); //so user duoc tao 7 ngay
        statisticalMonth.shopMonth = thirtyDaysCountShop;

        // console.log(`New shops for today: ${todayCountShop}`);
        // console.log(`New shops for the past 7 days: ${sevenDaysCountShop}`);
        // console.log(`New shops for the past 30 days: ${thirtyDaysCountShop}`);
//
        //Send Bill
        const todaySendBills = await Bill.countDocuments({ createdAt: { $gte: today }, status:{ $in: [0, 1, 2 ] } });
        statisticalToday.sendBillsToday = todaySendBills;
        const sevenDaysAgoSendBills = await Bill.countDocuments({ createdAt: { $gte: sevenDaysAgo },status:{ $in: [0, 1, 2] } });
        statisticalWeek.sendBillsWeek = sevenDaysAgoSendBills;
        const thirtyDaysAgoSendBills = await Bill.countDocuments({ createdAt: { $gte: thirtyDaysAgo },status:{ $in: [0, 1, 2] } });
        statisticalMonth.sendBillsMonth = thirtyDaysAgoSendBills;
        // console.log(`New send bills for today: ${todaySendBills}`);
        // console.log(`New send bills for the past 7 days: ${sevenDaysAgoSendBills}`);
        // console.log(`New send bills for the past 30 days: ${thirtyDaysAgoSendBills}`);

        //Complete Bill
        const todayCompleteBills = await Bill.countDocuments({ createdAt: { $gte: today }, status:{ $in: [3 ] } });
        statisticalToday.completeBillsToday = todayCompleteBills;
        const sevenDaysAgoCompleteBills = await Bill.countDocuments({ createdAt: { $gte: sevenDaysAgo },status:{ $in: [3] } });
        statisticalWeek.completeBillsWeek = sevenDaysAgoCompleteBills;
        const thirtyDaysAgoCompleteBills = await Bill.countDocuments({ createdAt: { $gte: thirtyDaysAgo },status:{ $in: [3] } });
        statisticalMonth.completeBillsMonth = thirtyDaysAgoCompleteBills;
        // console.log(`New complete bills for today: ${todayCompleteBills}`);
        // console.log(`New complete bills for the past 7 days: ${sevenDaysAgoCompleteBills}`);
        // console.log(`New complete bills for the past 30 days: ${thirtyDaysAgoCompleteBills}`);



//
//
//         //const today = new Date();
//         // console.log("day la 7 ngay cua sach thuong")
//
//         const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 6);
//         const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
//         // Create an empty map to store the counts
//         const dataThisWeekRegularTemplate = {};
//         // Iterate over each day of the week
//         for (let i = 0; i < 7; i++) {
//             const currentDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
//             const nextDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i + 1);
//             // Count posts for the current day
//             const postsCount = await Post.countDocuments({ createdAt: { $gte: currentDate, $lt: nextDate } });
//             // Get the day name
//             const dayName = currentDate.toLocaleDateString('vi-VN', )
//             // Save the count in the map
//             dataThisWeekRegularTemplate[`${dayName}`] = postsCount
//         }
//         // đây là mẫu lấy data cột regular. đổi lại tên biến thành dataThisWeekRegularTemplate.
//         // bên dưới khai báo mới lại và lấy keys values từ Object
//         let dataThisWeekRegular ={};
//         dataThisWeekRegular.label= Object.keys(dataThisWeekRegularTemplate)
//         dataThisWeekRegular.data = Object.values(dataThisWeekRegularTemplate)
//
// console.log(Object.keys(dataThisWeekRegularTemplate))
//         // Print the maps
//         console.log(dataThisWeekRegularTemplate);
//
//         console.log(dataThisWeekRegular);
//
//         console.log("day la 7 ngay cua sach dau gia")
//         const dataThisWeekAuction = {};
//         const admin = require('firebase-admin')
//         for (let i = 0; i < 7; i++) {
//             const currentDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
//             const nextDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i + 1);
//             // Count posts for the current day
//             const postsRef = admin.firestore().collection('PostAuction');
//             const query = postsRef
//                 .where('createdAt', '>=', currentDate.toISOString())
//                 .where('createdAt', '<', nextDate.toISOString());
//             const snapshot = await query.get();
//             const postsCount = snapshot.size;
//             // Get the day name
//             const dayName = currentDate.toLocaleDateString('vi-VN', )
//             // Save the count in the map
//             dataThisWeekAuction[`${dayName}`] = postsCount
//         }
//         console.log(dataThisWeekAuction)
//
//         // thong ke category.
//
        // await Bill.countByCategory().then((value,err)=>{
        //     console.log(value)
        // })
//     // đếm sách trong các bill (chưa tính status bill đã hoàn thành hay chưa) tối hỏi
        const categoryCounts = await Bill.countByCategory();
        // console.log(categoryCounts);
        // thống kê số lượng người dùng vip và thường
        // các bạn tự giới hạn số thập phân hoặc làm tròn nhé
        // hoặc làm tròn 1 cái rồi lấy 100% trừ cho cái đó là ra cái còn lại
        // await User.calculateRolePercentage().then((result,err)=>{
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         const totalUsers = result.reduce((total, item) => total + item.count, 0);
        //         result.forEach(item => {
        //             const percentage = (item.count / totalUsers) * 100;
        //             console.log(`Phần trăm người dùng có vai trò ${item.role}: ${percentage}%`);
        //             console.log("----------")
        //         });
        //     }
        // })



        res.render('statistical/account_statistics',{
            statisticalToday,
            statisticalWeek,
            statisticalMonth,
            categoryCounts,
            // dataThisWeekRegular,
            // regularUserPercentage,
            // vipUserPercentage
        });
        },
}
module.exports = statisticalController
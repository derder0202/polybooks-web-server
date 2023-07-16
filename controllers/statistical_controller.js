const {User, Post, Bill, Shop} = require("../api_src/model/model");
const statisticalController = {
    liststatistical: async (req,res)=>{
        let statisticalToday = {}
        console.log("?")
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
        
        console.log(`New users for today: ${todayCountUser}`);
        console.log(`New users for the past 7 days: ${sevenDaysCountUser}`);
        console.log(`New users for the past 30 days: ${thirtyDaysCountUser}`);
        //làm tương tự với các model còn lại bao gồm Shop, Post, Bill(gửi đi và hoàn thành check status(

        //POST
        const todayCountPost = await Post.countDocuments({createAt: { $gte: today },postStatus:{$gte: 1}});
        statisticalToday.postToday = todayCountPost;

        const sevenDaysCountPost = await Post.countDocuments({ createdAt: { $gte: sevenDaysAgo },postStatus:{$gte: 1} }); //so user duoc tao 7 ngay
        statisticalWeek.postWeek = sevenDaysCountPost;

        const thirtyDaysCountPost = await Post.countDocuments({ createdAt: { $gte: sevenDaysAgo },postStatus:{$gte: 1} }); //so user duoc tao 7 ngay
        statisticalMonth.postMonth = thirtyDaysCountPost;

        console.log(`New posts for today: ${todayCountPost}`);
        console.log(`New posts for the past 7 days: ${sevenDaysCountPost}`);
        console.log(`New posts for the past 30 days: ${thirtyDaysCountPost}`);

        //Shop
        const todayCountShop = await Shop.countDocuments({createAt: { $gte: today } });
        statisticalToday.shopToday = todayCountShop;

        const sevenDaysCountShop = await Shop.countDocuments({ createdAt: { $gte: sevenDaysAgo } }); //so user duoc tao 7 ngay
        statisticalWeek.shopWeek = sevenDaysCountShop;

        const thirtyDaysCountShop = await Shop.countDocuments({ createdAt: { $gte: sevenDaysAgo } }); //so user duoc tao 7 ngay
        statisticalMonth.shopMonth = thirtyDaysCountShop;

        console.log(`New shops for today: ${todayCountShop}`);
        console.log(`New shops for the past 7 days: ${sevenDaysCountShop}`);
        console.log(`New shops for the past 30 days: ${thirtyDaysCountShop}`);

        //Bill
        const todayCountBill = await Bill.countDocuments({createAt: { $gte: today }, status:{$gte: 0} });
        statisticalToday.billToday = todayCountBill;
        const sevenDaysCountBill = await Bill.countDocuments({createAt: { $gte: today }, status:{$gte: 0} });
        statisticalWeek.billWeek = sevenDaysCountBill;
        const thirtyDaysCountBill = await Bill.countDocuments({createAt: { $gte: today }, status:{$gte: 0} });
        statisticalMonth.billMonth = thirtyDaysCountBill;

        console.log(`New bill for today: ${todayCountBill}`);
        console.log(`New bill for the past 7 days: ${sevenDaysCountBill}`);
        console.log(`New bill for the past 30 days: ${thirtyDaysCountBill}`);


        // cai nay danh cho ben sách thống kê. chưa hiểu lắm cách viết data
        //const today = new Date();
        console.log("day la 7 ngay cua sach thuong")
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()-6);
        const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() );
        // Create an empty map to store the counts
        const dataThisWeekRegularTemplate = {};
        // Iterate over each day of the week
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
            const nextDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i + 1);
            // Count posts for the current day
            const postsCount = await Post.countDocuments({ createdAt: { $gte: currentDate, $lt: nextDate } });
            // Get the day name
            const dayName = currentDate.toLocaleDateString('vi-VN', )
            // Save the count in the map
            dataThisWeekRegularTemplate[`${dayName}`] = postsCount
        }
        let dataThisWeekRegular ={};
        dataThisWeekRegular.label= Object.keys(dataThisWeekRegularTemplate)
        dataThisWeekRegular.data = Object.values(dataThisWeekRegularTemplate)

console.log(Object.keys(dataThisWeekRegularTemplate))
        // Print the maps
        console.log(dataThisWeekRegularTemplate);

        console.log("day la 7 ngay cua sach dau gia")
        const dataThisWeekAuction = {};
        const admin = require('firebase-admin')
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
            dataThisWeekAuction[`${dayName}`] = postsCount
        }
        console.log(dataThisWeekAuction)

        // thong ke category.
        
        // await Bill.countByCategory().then((value,err)=>{
        //     console.log(value)
        // })
    // đếm sách trong các bill (chưa tính status bill đã hoàn thành hay chưa) tối hỏi
        const categoryCounts = await Bill.countByCategory();
        console.log(categoryCounts);
        //thống kê số lượng người dùng vip và thường
        //các bạn tự giới hạn số thập phân hoặc làm tròn nhé
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
        const totalUsers = await User.countDocuments();
        const regularUsers = await User.countDocuments({ role: '0' });
        const vipUsers = await User.countDocuments({ role: '1' });
        const regularUserPercentage = Math.round((regularUsers / totalUsers) * 100);
        const vipUserPercentage = Math.round((vipUsers / totalUsers) * 100);
        console.log(`Total users: ${totalUsers}`);
        console.log(`Regular users: ${regularUsers}`);
        console.log(`VIP users: ${vipUsers}`);
        console.log(`Regular user percentage: ${regularUserPercentage}%`);
        console.log(`VIP user percentage: ${vipUserPercentage}%`);


        res.render('statistical/account_statistics',{
            statisticalToday,
            statisticalWeek,
            statisticalMonth, 
            categoryCounts,
            dataThisWeekRegular,
            regularUserPercentage,
            vipUserPercentage});
        },
}
module.exports = statisticalController
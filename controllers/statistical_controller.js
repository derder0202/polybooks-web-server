const {User, Post, Bill} = require("../api_src/model/model");
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


        // cai nay danh cho ben sách thống kê. chưa hiểu lắm cách viết data
        //const today = new Date();
        console.log("day la 7 ngay cua sach thuong")
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
        // Create an empty map to store the counts
        const dataThisWeekRegular = {};
        // Iterate over each day of the week
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
            const nextDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i + 1);
            // Count posts for the current day
            const postsCount = await Post.countDocuments({ createdAt: { $gte: currentDate, $lt: nextDate } });
            // Get the day name
            const dayName = currentDate.toLocaleDateString('vi-VN', )
            // Save the count in the map
            dataThisWeekRegular[`${dayName}`] = postsCount
        }
        // Print the maps
        console.log(dataThisWeekRegular);

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
        // đếm sách trong các bill (chưa tính status bill đã hoàn thành hay chưa)
        await Bill.countByCategory().then((value,err)=>{
            console.log(value)
        })

        //thống kê số lượng người dùng vip và thường
        //các bạn tự giới hạn số thập phân hoặc làm tròn nhé
        // hoặc làm tròn 1 cái rồi lấy 100% trừ cho cái đó là ra cái còn lại
        await User.calculateRolePercentage().then((result,err)=>{
            if (err) {
                console.log(err);
            } else {
                const totalUsers = result.reduce((total, item) => total + item.count, 0);
                result.forEach(item => {
                    const percentage = (item.count / totalUsers) * 100;
                    console.log(`Phần trăm người dùng có vai trò ${item.role}: ${percentage}%`);
                });
            }
        })


        res.render('statistical/account_statistics',{statisticalToday,statisticalWeek,statisticalMonth });

    },
}
module.exports = statisticalController
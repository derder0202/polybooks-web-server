const {User, Post} = require("../api_src/model/model");
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
        // Count new users for the past 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysCountUser = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        console.log(`New users for today: ${todayCountUser}`);
        console.log(`New users for the past 7 days: ${sevenDaysCountUser}`);
        console.log(`New users for the past 30 days: ${thirtyDaysCountUser}`);
        //làm tương tự với các model còn lại bao gồm Shop, Post, Bill(gửi đi và hoàn thành check status(


        // cai nay danh cho ben sách thống kê. chưa hiểu lắm cách viết data
        //const today = new Date();
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
        // Create an empty map to store the counts
        const dataThisWeek = {};
        // Iterate over each day of the week
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
            const nextDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i + 1);
            // Count posts for the current day
            const postsCount = await Post.countDocuments({ createdAt: { $gte: currentDate, $lt: nextDate } });
            // Get the day name
            const dayName = currentDate.toLocaleDateString('vi-VN', { weekday: 'long' });
            // Save the count in the map
            dataThisWeek[`${dayName}`] = postsCount
        }
        // Print the map
        console.log(dataThisWeek);


        res.render('statistical/account_statistics');

    },
}
module.exports = statisticalController
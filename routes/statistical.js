var express = require('express');
const statisticalController = require("../controllers/statistical_controller");
const checkAuth = require("../api_src/middleware/checkAuth");
const {User, Post} = require("../api_src/model/model");
var router = express.Router();


router.get('/',statisticalController.liststatistical)

router.get('/getVipUser',async(req,res)=>{
    //const totalUsers = await User.countDocuments();
    const regularUsers = await User.countDocuments({ role: '0' });
    const vipUsers = await User.countDocuments({ role: '1' });
    const regularUserPercentage = Math.round((regularUsers / (regularUsers+vipUsers)) * 100);
    const vipUserPercentage = Math.round((vipUsers / (regularUsers+vipUsers)) * 100);
    res.json({regularUserPercentage, vipUserPercentage})

})


router.get('/getRegularBookDataChart',async(req,res)=>{
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 6);
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
    // đây là mẫu lấy data cột regular. đổi lại tên biến thành dataThisWeekRegularTemplate.
    // bên dưới khai báo mới lại và lấy keys values từ Object
    let dataThisWeekRegular ={};
    dataThisWeekRegular.label= Object.keys(dataThisWeekRegularTemplate)
    dataThisWeekRegular.data = Object.values(dataThisWeekRegularTemplate)
    res.json(dataThisWeekRegular)
})

module.exports = router;
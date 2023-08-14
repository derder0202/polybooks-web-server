const { config } = require("dotenv");
const {User, Post, Bill, Shop} = require("../api_src/model/model");
const statisticalController = {
    liststatistical: async (req,res)=>{
    let urls = require("../config_url")
    const categoryCounts = await Bill.countByCategory();
    const filteredCategoryCounts = categoryCounts.filter(item => item.count >= 5);
    const userName = req.user.fullName;
    const userEmail = req.user.email;
    res.render('statistical/account_statistics',{
        partials: {
            nav_header: 'partials/nav_header'
        },
        categoryCounts: filteredCategoryCounts, 
        urls,
        userName,
        userEmail
    });   
},
}
module.exports = statisticalController
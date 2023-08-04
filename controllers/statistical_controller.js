const { config } = require("dotenv");
const {User, Post, Bill, Shop} = require("../api_src/model/model");
const statisticalController = {
    liststatistical: async (req,res)=>{
    let urls = require("../config_url")
    const categoryCounts = await Bill.countByCategory();
    const filteredCategoryCounts = categoryCounts.filter(item => item.count >= 5);
    console.log(req.user)
    res.render('statistical/account_statistics',{
        categoryCounts: filteredCategoryCounts, 
        urls
        });
    },
}
module.exports = statisticalController
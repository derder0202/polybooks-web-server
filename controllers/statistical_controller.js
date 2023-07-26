const { config } = require("dotenv");
const {User, Post, Bill, Shop} = require("../api_src/model/model");
const statisticalController = {
    liststatistical: async (req,res)=>{
 quan_ly_shop_26_7
       let urls = require("../config_url")
       console.log(urls)

        
//     // đếm sách trong các bill (chưa tính status bill đã hoàn thành hay chưa) tối hỏi
        const categoryCounts = await Bill.countByCategory();
       
        res.render('statistical/account_statistics',{
            categoryCounts, 
            urls
        });
        },
}
module.exports = statisticalController
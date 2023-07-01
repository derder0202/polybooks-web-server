const adManagementController = {
    listManagement: async (req,res)=>{
        // cần list đầy đủ của member thường
        res.render('advertisement/ad_management');
    },
    detailManagement: async (req,res)=>{
        // cần list đầy đủ của member thường
        res.render('advertisement/banner_details');
    },
}
module.exports = adManagementController
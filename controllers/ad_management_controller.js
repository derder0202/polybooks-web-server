const adManagementController = {
    listManagement: async (req,res)=>{
        // cần list đầy đủ của member thường
        res.render('advertisement/ad_management');
    },
    
}
module.exports = adManagementController
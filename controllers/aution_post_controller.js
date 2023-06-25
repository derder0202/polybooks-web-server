const autionpostController = {
    listAutionpost: async (req,res)=>{
        // cần list đầy đủ của member thường
        res.render('aution_post/list_aution_post');
    },
    
}
module.exports = autionpostController
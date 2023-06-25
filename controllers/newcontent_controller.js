const newcontentController = {
    listNewContent: async (req,res)=>{
        // cần list đầy đủ của member thường
        res.render('content_approval/new_approval');
    },
}
module.exports = newcontentController
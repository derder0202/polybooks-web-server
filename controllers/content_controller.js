const contentController = {
    listContent: async (req,res)=>{
        // cần list đầy đủ của member thường
        res.render('content_approval/book_approval');
    },
}
module.exports = contentController
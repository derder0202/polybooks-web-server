const Post = require("../api_src/model/model").Post;

const autionApprovalController ={
    //list duyệt bài đấu giá
    listAutionApproval: async (req,res) =>{
        try {
            const listAution = await Post.find({postStatus : 0}).populate("seller","fullName");
            res.render('content_approval/aution_approval',{listAution})

        } catch (e) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách duyệt đấu giá');

        }
    },

    
}
module.exports = autionApprovalController;
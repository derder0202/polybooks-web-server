const Post = require("../api_src/model/model").Post;

const autionApprovalController ={
    //list duyệt bài đấu giá
    listAutionApproval: async (req,res) =>{
        try {
            const listAution = await Post.find({postStatus : 0})
            res.render('content_approval/aution_approval',{listAution})

        } catch (e) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách duyệt đấu giá');

        }
    },

    detailAutionApproval: async (req,res) =>{
        let detailAution = await Post.findById(req.params.id)
            .exec()
            .catch(function (err) {
                console.log(err)
            });
        console.log(detailAution)
        if (detailAution == null){
            res.send('Không tìm thấy bản ghi');
        }
        res.render('content_approval/detail_aution_approval',{detailAution})

        // res.render('content_approval/detail_aution_approval')

    }
}
module.exports = autionApprovalController;
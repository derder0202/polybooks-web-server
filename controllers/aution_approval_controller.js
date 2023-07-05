const Post = require("../api_src/model/model").Post;
const admin = require('firebase-admin');
const autionApprovalController ={
    //list duyệt bài đấu giá
    listAutionApproval: async (req,res) =>{
        try {
            const listAution = await Post.find({postStatus : 0}).populate("seller","fullName");
            const db = admin.firestore();
            const documentList = [];
            db.collection("PostAuction").get()
                .then((snap)=>{
                    snap.forEach((doc)=>
                        documentList.push(doc.data())
                    )
                    console.log(documentList) // lưu ý chỉ dùng documentList trong này được thôi. vì bất đồng bộ nên không mang ra ngoài được
                })




            res.render('content_approval/aution_approval',{listAution})

        } catch (e) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách duyệt đấu giá');

        }
    },

    
}
module.exports = autionApprovalController;
const Post = require("../api_src/model/model").Post;
const admin = require('firebase-admin');
const autionPostController ={
    //list duyệt bài đấu giá
    listAutionApproval: async (req,res) =>{
        try {
            const listAution = await Post.find().populate("seller","fullName");
            const db = admin.firestore();
            const documentList = [];

            const snapshot = await db.collection("PostAuction").get();
            snapshot.forEach((doc) => {
            documentList.push(doc.data());
      });
        console.log(documentList);

        res.render('aution_post/list_aution_post', { documentList });
        } catch (e) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách duyệt đấu giá');

        }
    },   
}
module.exports = autionPostController;
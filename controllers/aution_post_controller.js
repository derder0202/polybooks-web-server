const admin = require('firebase-admin');
const autionPostController ={
    //list duyệt bài đấu giá
    listAutionApproval: async (req,res) =>{
        try {
            
            const db = admin.firestore();
            const documentList = [];

            const snapshot = await db.collection("PostAuction")
            .where("auctionType", "==", 1)
            .where('createdAt', '>', new Date().toISOString())
            .get();
            snapshot.forEach((doc) => {
            documentList.push(doc.data());
      });
      console.log(new Date());
        // console.log(documentList);

        res.render('aution_post/list_aution_post', { documentList });
        } catch (e) {
            console.error(e);
            res.status(500).send('Lỗi khi lấy danh sách duyệt đấu giá');

        }
    },   
}
module.exports = autionPostController;
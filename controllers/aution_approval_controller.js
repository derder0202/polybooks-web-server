const admin = require('firebase-admin');
const autionApprovalController ={
    listAutionApproval: async (req,res) =>{
        try {
            const db = admin.firestore();
            const documentList = [];

            const snapshot = await db.collection("PostAuction").get();
            snapshot.forEach((doc) => {
            documentList.push(doc.data());
        });
        

        res.render('content_approval/aution_approval', { documentList });
        } catch (e) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách duyệt đấu giá');
        }
    },
    detailAution: async (req, res) => {
        try {
            const db = admin.firestore();
            const docRef = db.collection("PostAuction").doc(req.params.id);
            const doc = await docRef.get();
            
      
            if (!doc.exists) {
              res.status(404).send("Danh sách duyệt đấu giá không tồn tại");
              return;
            }
            const auctionData = doc.data();
            console.log(auctionData);
      
            res.render('content_approval/detail_aution', {auctionData});
          } catch (error) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy thông tin duyệt đấu giá');
          }
        }
    }
module.exports = autionApprovalController;



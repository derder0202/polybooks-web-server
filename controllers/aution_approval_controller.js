const admin = require('firebase-admin');
const moment = require('moment');

const autionApprovalController ={
    listAutionApproval: async (req,res) =>{
        try {
            const db = admin.firestore();
            const documentList = [];

            const snapshot = await db.collection("PostAuction").get();
            snapshot.forEach((doc) => {
            documentList.push({_id:doc.id,...doc.data()});
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
          const snapshot = await docRef.get();
      
          if (!snapshot.exists) {
            res.status(404).send("Danh sách duyệt đấu giá không tồn tại");
            return;
          }
      
          const auctionData = {_id: snapshot.id, ...snapshot.data()};
      
          console.log(auctionData);
      
          res.render('content_approval/detail_aution', { auctionData });
        } catch (error) {
          console.error(error);
          res.status(500).send('Lỗi khi lấy thông tin duyệt đấu giá');
        }
      },
    browseAuction: async (req,res) => {
      try {
        const db = admin.firestore();
        const docRef = db.collection("PostAuction").doc(req.params.id);

        if (req.body.action === 'duyet') {
          auctionType = 1;
        } else if (req.body.action === 'khongduyet') {
          auctionType = 3;
        }
    

        const currentTime = moment();
        const updatedTime = moment(currentTime).add(1, 'hour');
        const formattedTime = updatedTime.format('YYYY-MM-DD HH:mm:ss.SSS');

        await docRef.update({auctionType,createdAt: formattedTime });

        res.redirect('/AutionApproval');
        } catch (error) {
          console.error(error);
          res.status(500).send('Lỗi khi duyệt bài');
        } 
      }  
    }
module.exports = autionApprovalController;



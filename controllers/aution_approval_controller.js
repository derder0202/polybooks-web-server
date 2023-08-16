const admin = require('firebase-admin');
const moment = require('moment');
const {Post,Report,WithdrawRequest} = require("../api_src/model/model");

const autionApprovalController ={
    listAutionApproval: async (req,res) =>{
        const listBook = await Post.find({postStatus : 0}).populate("seller", "fullName").populate("category","name");
        const listReport = await Report.find({status : 0});
        const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
        try {
            const db = admin.firestore(); 
            const documentList = [];
            const snapshot = await db.collection("PostAuction").where("auctionType","==",0).get();
            snapshot.forEach((doc) => {
            documentList.push({_id:doc.id,...doc.data()});
        });
          const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length + documentList.length;
          const userName = req.user.fullName;
          const userEmail = req.user.email;
        res.render('content_approval/aution_approval', {
          partials: {
            nav_header: 'partials/nav_header'
        },
          documentList,
          userName,
          userEmail,
          listBook,
          totalItemCount,
          listBrowsewithdrawals,
          listReport,
        });
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

          const listBook = await Post.find({postStatus : 0}).populate("seller", "fullName").populate("category","name");
          const listReport = await Report.find({status : 0});
          const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
          const documentList = [];
          const snapshots = await db.collection("PostAuction").where("auctionType","==",0).get();
          snapshots.forEach((doc) => {
          documentList.push({_id:doc.id,...doc.data()});
          });
          const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length + documentList.length;
          const userName = req.user.fullName;
          const userEmail = req.user.email;
      
          res.render('content_approval/detail_aution', {
            partials: {
              nav_header: 'partials/nav_header'
            },
            auctionData,
            documentList,
            userName,
            userEmail,
            listBook,
            totalItemCount,
            listBrowsewithdrawals,
            listReport,
          });
        } catch (error) {
          console.error(error);
          res.status(500).send('Lỗi khi lấy thông tin duyệt đấu giá');
        }
      },
    browseAuction: async (req,res) => {
      try {
        const db = admin.firestore();
        const FCM = admin.messaging();
        const docRef = db.collection("PostAuction").doc(req.params.id);

        const currentTime = moment();
        const updatedTime = moment(currentTime).add(1, 'hour');
        const formattedTime = updatedTime.format('YYYY-MM-DD HH:mm:ss.SSS');

        const endTime = moment(currentTime).add(24, 'hours');
        const formattedEndTime = endTime.format('YYYY-MM-DD HH:mm:ss.SSS');

        if (req.body.action === 'duyet') {
          auctionType = 1;

          const message = {
            topic: 'Auction', // Chủ đề muốn gửi thông báo tới
            notification: {
              title: 'Đấu giá',
              body: 'Có sách hiếm đang chờ đấu giá',
            },
          };
          
          // Gửi thông báo bằng FCM
          await FCM.send(message);
        } else if (req.body.action === 'khongduyet') {
          auctionType = 3;
          const reason = req.body.reason;
          await docRef.update({ auctionType, createdAt: formattedTime, replyToAuction: reason});
        }
        await docRef.update({auctionType,createdAt: formattedTime,endTime: formattedEndTime });

        res.redirect('/AutionApproval');
        } catch (error) {
          console.error(error);
          res.status(500).send('Lỗi khi duyệt bài');
        } 
      }  
    }
module.exports = autionApprovalController;



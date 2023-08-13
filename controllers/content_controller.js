const {Post,Report,WithdrawRequest} = require("../api_src/model/model");
const admin = require('firebase-admin');
const contentController = {
    //list duyệt bài đăng bán
    listContent: async (req,res)=>{
        try {
            const listBook = await Post.find({postStatus : 0}).populate("seller", "fullName").populate("category","name");
            const listReport = await Report.find({status : 0});
            const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
            const db = admin.firestore();
            const documentList = [];
            const snapshot = await db.collection("PostAuction").where("auctionType","==",0).get();
            snapshot.forEach((doc) => {
            documentList.push({_id:doc.id,...doc.data()});
            });
            const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length + documentList.length;
            const userName = req.user.fullName;
            const userEmail = req.user.email;
            res.render('content_approval/book_approval',{
              partials: {
                nav_header: 'partials/nav_header'
              },
              listBook,
              documentList,
              userName,
              userEmail,
              totalItemCount,
              listBrowsewithdrawals,
              listReport
            });
        }catch (e) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách duyệt sách bán');
        }
    },
    detailAutionApproval: async (req,res) =>{
        let detailAution = await Post.findById(req.params.id).populate("author","name").populate("category","name").populate("publisher","name")
            .exec()
            .catch(function (err) {
                console.log(err)
            });
        if (detailAution == null){
            res.send('Không tìm thấy bản ghi');
        }
        const listBook = await Post.find({postStatus : 0}).populate("seller", "fullName").populate("category","name");
        const listReport = await Report.find({status : 0});
        const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
        const db = admin.firestore();
        const documentList = [];
        const snapshot = await db.collection("PostAuction").where("auctionType","==",0).get();
        snapshot.forEach((doc) => {
        documentList.push({_id:doc.id,...doc.data()});
        });
        const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length + documentList.length;
        const userName = req.user.fullName;
        const userEmail = req.user.email;
        res.render('content_approval/detail_aution_approval',{
          partials: {
            nav_header: 'partials/nav_header'
          },
          detailAution,
          userName,
          documentList,
          userEmail,
          listBook,
          totalItemCount,
          listBrowsewithdrawals,
          listReport,
        })
    },
    approveAution : async (req, res) => {
        try {
          const detailAution = await Post.findById(req.params.id);
      
          if (!detailAution) {
            return res.send('Không tìm thấy bản ghi');
          }
      
          if (req.body.action === 'approve') {
            detailAution.postStatus = 1;
          } else if (req.body.action === 'reject') {
            detailAution.postStatus = 3;
            detailAution.replyToPost = req.body.replyToPost;
          }
      
          await detailAution.save();
      
          console.log('Thông tin được thay đổi:', detailAution);
          res.redirect('/BookApproval');
        } catch (err) {
          console.error(err);
          res.status(500).send('Đã xảy ra lỗi server');
        }
    }
    
    // //list duyệt bài đấu giá
    // listAutionApproval: async (req,res) =>{
    //     try {
    //         const listAution = await Post.find({postStatus : 0})
    //         res.render('content_approval/aution_approval',{listAution})
    //
    //     } catch (e) {
    //         console.error(error);
    //         res.status(500).send('Lỗi khi lấy danh sách duyệt đấu giá');
    //
    //     }
    // },
    //
    // detailAutionApproval: async (req,res) =>{
    //     let detailAution = await Post.find(req.params.id)
    //         .exec()
    //         .catch(function (err) {
    //             console.log(err)
    //         });
    //     console.log(detailAution)
    //     if (detailAution == null){
    //         res.send('Không tìm thấy bản ghi');
    //     }
    //     res.render('content_approval/detail_aution_approval',{detailAution})
    //
    //     // res.render('content_approval/detail_aution_approval')
    //
    // }

}
module.exports = contentController
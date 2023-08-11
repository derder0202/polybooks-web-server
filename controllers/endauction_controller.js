const admin = require('firebase-admin');
const {Post,Report,WithdrawRequest} = require("../api_src/model/model");

const endAuctionController = {
  listEndAuction: async (req, res) => {
    const listBook = await Post.find({postStatus : 0});
    const listReport = await Report.find({status : 0});
    const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
    const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length;
    try {
      const db = admin.firestore();
      const documentList = [];

      const currentDate = new Date(); // Lấy thời gian hiện tại

      const snapshot = await db.collection("PostAuction").get();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const endTimeDate = new Date(data.endTime); // Chuyển đổi chuỗi thành đối tượng Date

        if (endTimeDate <= currentDate && data.auctionType === 1) {
          // Hiển thị dữ liệu nếu thời gian hiện tại đã qua thời gian của trường endTime
          documentList.push(data);
        }
      });
      const userName = req.user.fullName;
      const userEmail = req.user.email;
      res.render('aution_post/list_end_auction', {
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
      console.error(e);
      res.status(500).send('Lỗi khi lấy danh sách đấu giá đã kết thúc');
    }
  },
};

module.exports = endAuctionController;

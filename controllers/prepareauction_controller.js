const admin = require('firebase-admin');
const {Post,Report,WithdrawRequest} = require("../api_src/model/model");

const endAuctionController = {
    listPrepareAuction: async (req, res) => {
    const listBook = await Post.find({postStatus : 0});
    const listReport = await Report.find({status : 0});
    const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
    const db = admin.firestore();
    const documentList = [];
    const snapshot = await db.collection("PostAuction").where("auctionType","==",0).get();
    snapshot.forEach((doc) => {
    documentList.push({_id:doc.id,...doc.data()});
    });
    const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length + documentList.length;

    try {
      const db = admin.firestore();
      const documentLists = [];

      const currentDate = new Date(); // Lấy thời gian hiện tại

      const snapshot = await db.collection("PostAuction").get();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const createdAtDate = new Date(data.createdAt); // Chuyển đổi chuỗi thành đối tượng Date
        const endTimeDate = new Date(data.endTime); // Chuyển đổi chuỗi thành đối tượng Date

        if (createdAtDate <= currentDate && currentDate <= endTimeDate && data.auctionType === 1) {
          // Hiển thị dữ liệu nếu thời gian hiện tại nằm giữa thời gian của trường createdAt và endTime
          // Tính khoảng thời gian giữa createdAt và endTime
          const timeDifferenceInMilliseconds = endTimeDate.getTime() - createdAtDate.getTime();

          // Chuyển khoảng thời gian sang đơn vị phút (hoặc đơn vị thời gian mong muốn khác)
          const timeDifferenceInMinutes = timeDifferenceInMilliseconds / (1000 * 60);

          // Làm tròn thời gian thành số nguyên
          const roundedTimeDifference = Math.round(timeDifferenceInMinutes);

          // Thêm khoảng thời gian vào object data
          data.roundedTimeDifference  = roundedTimeDifference;
          
          documentLists.push(data);
        }
      });
      const userName = req.user.fullName;
      const userEmail = req.user.email;
      res.render('aution_post/list_prepare_auction', {
        partials: {
          nav_header: 'partials/nav_header'
        },
        documentLists,
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

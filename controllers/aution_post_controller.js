const admin = require('firebase-admin');

const autionPostController = {
  listAutionApproval: async (req, res) => {
    try {
      const db = admin.firestore();
      const documentList = [];

      const currentDate = new Date(); // Lấy thời gian hiện tại

      const snapshot = await db.collection("PostAuction").get();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const createdAtDate = new Date(data.createdAt); // Chuyển đổi chuỗi thành đối tượng Date

        if (createdAtDate > currentDate && data.auctionType === 1) {
          // Hiển thị dữ liệu nếu thời gian hiện tại trước thời gian của trường createdAt
          documentList.push(data);
        }
      });
      const userName = req.user.fullName;
      const userEmail = req.user.email;
      res.render('aution_post/list_aution_post', { 
      partials: {
        nav_header: 'partials/nav_header'
      },
        documentList,
        userName,
        userEmail
      });
    } catch (e) {
      console.error(e);
      res.status(500).send('Lỗi khi lấy danh sách duyệt đấu giá');
    }
  },
};

module.exports = autionPostController;

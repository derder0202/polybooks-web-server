const admin = require('firebase-admin');
const endAuctionController = {
    listEndAuction: async (req,res) =>{
        try {
            const db = admin.firestore();
            const documentList = [];

            const currentTime = new Date().toISOString();
            console.log("Current Time:", currentTime);
            const snapshot = await db.collection("PostAuction")
            .where("auctionType", "==", 1)
            // .where('createdAt', '<=', new Date().toISOString())
            .where('endTime', '>', currentTime)
            .get();
            snapshot.forEach((doc) => {
            
            documentList.push(doc.data());
      });
        console.log(documentList);

        res.render('aution_post/list_end_auction', { documentList });
        } catch (e) {
            console.error(e);
            res.status(500).send('Lỗi khi lấy danh sách duyệt đấu giá');

        }
    },
}

module.exports = endAuctionController
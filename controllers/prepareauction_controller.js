const admin = require('firebase-admin');

const prepareAuctionController = {
    listPrepareAuction: async (req, res) => {
        try {
            const db = admin.firestore();
            const documentLists = [];
        
            const snapshot = await db.collection("PostAuction")
                .where("auctionType", "==", 1)
                .where('createdAt', '<=',new Date().toISOString())
                .get();

            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.endTime >= new Date().toISOString()) {
                    documentLists.push(doc.data());
                }
            });

            console.log(documentLists);

            res.render('aution_post/list_prepare_auction', { documentLists });
        } catch (e) {
            console.error(e);
            res.status(500).send('Lỗi khi lấy danh sách duyệt đấu giá');
        }
    },
};

module.exports = prepareAuctionController;

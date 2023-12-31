const {Bill, User, Post, Shop} = require("../model/model");
const billController = {
  getBills: async (req, res) => {
    try {
      const bills = await Bill.find()
          .populate('posts',"bookName price images")
          .populate('buyer', "fullName")
          .populate('seller',"fullName")
          .populate('shopId',"name")
      res.status(200).json(bills);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Lỗi máy chủ');
    }
  },
    checkBill:async (req, res) => {
        try {
            //req.body.postId
            //req.body.userId buyer
            const bill = await Bill.find({buyer:req.body.userId, "posts.0":req.body.postId})
            if (bill.length === 0) {
                return res.status(400).json({ result: false });
            }
            console.log(bill)
            res.status(200).json({result: true});
        } catch (error) {
            console.error(error.message);
            if (error.kind === 'ObjectId') {
                return res.status(400).json({ msg: 'Không tìm thấy hóa đơn' });
            }
            res.status(500).send('Lỗi máy chủ');
        }
    },
   getBillById: async (req, res) => {
    try {
      const bill = await Bill.findById(req.params.id)
          .populate('posts',"bookName price images")
          .populate('buyer', "fullName")
          .populate('seller',"fullName")
          .populate('shopId',"name")
      if (!bill) {
        return res.status(400).json({ msg: 'Không tìm thấy hóa đơn' });
      }
      res.status(200).json(bill);
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Không tìm thấy hóa đơn' });
      }
      res.status(500).send('Lỗi máy chủ');
    }
  },
   createBill: async (req, res) => {
    try {
      //const { posts, status, address, userId } = req.body;
      const bill = new Bill(req.body);
      if(req.body.buyer){
          await User.findByIdAndUpdate(req.body.buyer,{$push:{buyBills: bill}})
      }
      if(req.body.seller){
          await User.findByIdAndUpdate(req.body.seller,{$push:{sellBills: bill}})
      }
      if(req.body.shopId){
          await Shop.findByIdAndUpdate(req.body.shopId,{$push:{sellBills: bill}})
      }
      await bill.save();
      res.status(200).json(bill);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Lỗi máy chủ');
    }
  },
   updateBill: async (req, res) => {
    try {
      const { status,payment,reviewBuyer,reviewSeller } = req.body;
      let bill = await Bill.findById(req.params.id);
      if (!bill) {
        return res.status(400).json({ msg: 'Không tìm thấy hóa đơn' });
      }
      // bill.posts = posts;
        if(status){
            bill.status = status;
        }
        if(payment){
            bill.payment = payment
        }
        if(reviewBuyer){
            bill.reviewBuyer = reviewBuyer
        }
        if(reviewSeller){
            bill.reviewSeller = reviewSeller
        }
      // bill.address = address;
      // bill.userId = userId;
      await bill.save();
      res.status(200).json(bill);
    } catch (error) {
      res.status(500).send('Lỗi máy chủ');
    }
  },
   deleteBill: async (req, res) => {
    try {
      const bill = await Bill.findById(req.params.id);
      console.log(bill)
      if (!bill) {
        return res.status(400).json({ msg: 'Không tìm thấy hóa đơn' });
      }
        if(bill.buyer){
            await User.findByIdAndUpdate(req.body.buyer,{$pull:{buyBills: bill._id}})
        }
        if(bill.seller){
            await User.findByIdAndUpdate(req.body.seller,{$pull:{sellBills: bill._id}})
        }
        if(bill.shopId){
            await Shop.findByIdAndUpdate(req.body.shopId,{$pull:{sellBills: bill._id}})
        }
      await bill.deleteOne();
      res.json({ msg: 'Hóa đơn đã được xóa' });
    } catch (error) {
      console.error(error.message);
      // if (error.kind === 'ObjectId') {
      //   return res.status(400).json({ msg: 'Không tìm thấy hóa đơn' });
      // }
      res.status(500).send('Lỗi máy chủ');
    }
  },
};
 module.exports = billController;
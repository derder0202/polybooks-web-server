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
   getBillById: async (req, res) => {
    try {
      const bill = await Bill.findById(req.params.id).populate('posts').populate('userId');
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
      const { status } = req.body;
      let bill = await Bill.findById(req.params.id);
      if (!bill) {
        return res.status(400).json({ msg: 'Không tìm thấy hóa đơn' });
      }
      // bill.posts = posts;
      bill.status = status;
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
      if (!bill) {
        return res.status(400).json({ msg: 'Không tìm thấy hóa đơn' });
      }
        if(bill.buyer){
            await User.findByIdAndUpdate(req.body.buyer,{$pull:{buyBills: bill}})
        }
        if(bill.seller){
            await User.findByIdAndUpdate(req.body.seller,{$pull:{sellBills: bill}})
        }
        if(bill.shopId){
            await Shop.findByIdAndUpdate(req.body.shopId,{$pull:{sellBills: bill}})
        }
      await bill.deleteOne();
      res.json({ msg: 'Hóa đơn đã được xóa' });
    } catch (error) {
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Không tìm thấy hóa đơn' });
      }
      res.status(500).send('Lỗi máy chủ');
    }
  },
};
 module.exports = billController;
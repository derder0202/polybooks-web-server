const {Bill} = require("../model/model");
const billController = {
  getBills: async (req, res) => {
    try {
      const bills = await Bill.find().populate('posts').populate('userId');
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
      const { posts, status, address, userId } = req.body;
      const bill = new Bill({
        posts,
        status,
        address,
        userId,
      });
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
      console.error(error.message);
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Không tìm thấy hóa đơn' });
      }
      res.status(500).send('Lỗi máy chủ');
    }
  },
   deleteBill: async (req, res) => {
    try {
      const bill = await Bill.findById(req.params.id);
      if (!bill) {
        return res.status(400).json({ msg: 'Không tìm thấy hóa đơn' });
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
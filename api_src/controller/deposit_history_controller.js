const {DepositHistory} = require("../model/model");
const getAllDepositHistories = async (req, res) => {
  try {
    const depositHistories = await DepositHistory.find();
    res.status(200).json(depositHistories)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 const getDepositHistoryById = async (req, res) => {
  try {
    const depositHistory = await DepositHistory.findById(req.params.id);
    if (!depositHistory) return res.status(400).json({ message: 'Lịch sử nạp tiền không tìm thấy' });
    res.status(200).json(depositHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 const createDepositHistory = async (req, res) => {
  try {
    const depositHistory = await DepositHistory.create(req.body);
    res.status(200).json(depositHistory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
 const updateDepositHistoryById = async (req, res) => {
  try {
    const depositHistory = await DepositHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!depositHistory) return res.status(400).json({ message: 'Lịch sử nạp tiền không tìm thấy' });
    res.status(200).json({message:"thanh cong", data: depositHistory});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 const deleteDepositHistoryById = async (req, res) => {
  try {
    const depositHistory = await DepositHistory.findByIdAndDelete(req.params.id);
    if (!depositHistory) return res.status(404).json({ message: 'Lịch sử nạp tiền không tìm thấy' });
    res.status(200).json({ message: 'Lịch sử nạp tiền đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 module.exports = depositHistoryController = {
  getAllDepositHistories,
  getDepositHistoryById,
  createDepositHistory,
  updateDepositHistoryById,
  deleteDepositHistoryById
};
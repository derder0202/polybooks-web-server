 // Tạo báo cáo mới
const {Report} = require("../model/model");
 const createReport = async (req, res) => {
  try {
     const report = new Report(req.body);
     await report.save();
     res.status(200).json(report);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
 // Lấy tất cả báo cáo
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('userID', 'name email');
     res.status(200).json(reports);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
 // Lấy báo cáo theo ID
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
     const report = await Report.findById(id).populate('userID', 'name email');
     if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
     await User.findByIdAndUpdate(report.userId,{$push:{reports: report._id}})
     res.status(200).json(report);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
 // Cập nhật báo cáo
const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
     const report = await Report.findByIdAndUpdate(id,req.body,{new:true})
     if (!report) {
      return res.status(400).json({ success: false, message: 'Report not found' });
    }
     res.status(200).json({ success: true, report });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
 // Xóa báo cáo
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
     const report = await Report.findById(id);
     if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
     await report.deleteOne();
     res.status(200).json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
 module.exports = {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport
};
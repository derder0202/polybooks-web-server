 // Tạo báo cáo mới
const {Report} = require("../model/model");
 const createReport = async (req, res) => {
  try {
    const { userID, content, status, feedback, attachedFiles } = req.body;
     const report = new Report({
      userID,
      content,
      status,
      feedback,
      attachedFiles
    });
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
     const report = await Report.findById(id);
     if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
     const { content, status, feedback, attachedFiles } = req.body;
     report.content = content;
    report.status = status;
    report.feedback = feedback;
    report.attachedFiles = attachedFiles;
     await report.save();
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
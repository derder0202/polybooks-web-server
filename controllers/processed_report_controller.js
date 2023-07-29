const Report = require("../api_src/model/model").Report;
const User = require("../api_src/model/model").User;
const processedReportController = {
    listprocessedReport: async (req,res)=>{
        try {
            const listprocessedReport = await Report.find({status : 1}).populate('userId');
            res.render('report/processed_report',{listprocessedReport});
        }catch (e) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách report');
        }
    },
}
module.exports = processedReportController
const Report = require("../api_src/model/model").Report;
const pendingReportController = {
    listPendingReport: async (req,res)=>{
        try {
            const listReport = await Report.find();
            res.render('report/pending_report',{listReport});
        }catch (e) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách duyệt sách bán');
        }
    },
    detailReport: async (req,res)=>{
        let detailReports = await Report.findById(req.params.id)
            .exec()
            .catch(function (err) {
                console.log(err)
            });
        console.log(detailReports)
        if (detailAution == null){
            res.send('Không tìm thấy bản ghi');
        }
        res.render('report/detail_report');
    },
    replyfeedbackReport: async(req,res)=>{
        try {
            const detailReport = await Report.findById(req.params.id);
        
        if (!detailReport) {
            return res.send('Không tìm thấy bản ghi');
        }
        
        if (req.body.action === 'reply') {
            detailReport.status = 1;
        } else if (req.body.action === 'noreply') {
            detailReport.status = 3;
        }
        
        await detailReport.save();
        
        console.log('Thông tin được thay đổi:', detailReport);
        res.redirect('/PendingReport');
        } catch (err) {
            console.error(err);
            res.status(500).send('Đã xảy ra lỗi server');
        }
    }
}
module.exports = pendingReportController
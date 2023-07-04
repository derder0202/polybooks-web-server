const pendingReportController = {
    listPendingReport: async (req,res)=>{
        res.render('report/pending_report');
    },
    detailReport: async (req,res)=>{
        res.render('report/detail_report');
    },
}
module.exports = pendingReportController
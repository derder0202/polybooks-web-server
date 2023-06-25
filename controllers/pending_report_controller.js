const pendingReportController = {
    listPendingReport: async (req,res)=>{
        res.render('report/pending_report');
    },
}
module.exports = pendingReportController
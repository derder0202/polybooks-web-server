const {DepositHistory} = require("../model/model");
const moment = require('moment');
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
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
    };
 }
const createPaymentLink = async (req, res)=>{
        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        var tmnCode = "LH4KB9IF";
        var secretKey = "PYQGMCGPRIPWTBPYTKTJCOHTPGKZWWDK"
        var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        var returnUrl = "https://polybooks.store/depositHistory/VNPayReturn";
        var date = new Date();
        var createDate = moment(date).format("YYYYMMDDHHmmss") //dateFormat(date, 'yyyymmddHHmmss');
        var orderId = moment(date).format('HHmmss');

        var amount = req.body.amount;

        var orderInfo = req.body.orderDescription;
        var orderType = 78;
        var locale = 'vn';
        var currCode = 'VND';
        var vnp_Params = {};
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_TxnRef'] = orderId;

    vnp_Params['vnp_Version'] = '2.1.0';

        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params = sortObject(vnp_Params)
        // vnp_Params = Object.keys(vnp_Params).sort().reduce(
        //     (obj, key) => {
        //         obj[key] = vnp_Params[key];
        //         return obj;
        //     },
        //     {}
        // );

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        console.log(vnpUrl)
        //res.redirect(vnpUrl)
    res.json(vnpUrl)
// Vui lòng tham khảo thêm tại code demo
}

const VNPayReturn = async (req, res) => {
    try {
        var vnp_Params = req.query;

        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        var tmnCode = "LH4KB9IF";
        var secretKey = "PYQGMCGPRIPWTBPYTKTJCOHTPGKZWWDK"

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

        if(secureHash === signed){
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

            res.json({code: vnp_Params['vnp_ResponseCode']})
        } else{
            res.json({code: '97'})
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    };
}

 module.exports = depositHistoryController = {
  getAllDepositHistories,
  getDepositHistoryById,
  createDepositHistory,
  updateDepositHistoryById,
  deleteDepositHistoryById,
     createPaymentLink,
     VNPayReturn
};


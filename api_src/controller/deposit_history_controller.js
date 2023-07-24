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
        var tmnCode = process.env.TMN_CODE;
        var secretKey = process.env.SECRET_KEY
        var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        var returnUrl = "https://polybooks.store/api/depositHistory/VNPayReturn";
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
        vnp_Params = sortObject(vnp_Params)
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
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

        let message
        switch (vnp_Params['vnp_ResponseCode']) {
            case "24":
                message = "Giao dịch không thành công do: Khách hàng hủy giao dịch"
                break;
            case "00":
                message = "Giao dịch thành công"
                break;
            case "07":
                message = "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)."
                break;
            case "09":
                message = "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng."
                break;
            case "10":
                message = "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần"
                break;
            case "11":
                message = "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch."
                break;
            case "12":
                message = "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa."
                break;
            case "13":
                message = "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch."
                break;
            case "51":
                message = "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch."
                break;
            case "65":
                message = "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày."
                break;
            case "75":
                message = "Ngân hàng thanh toán đang bảo trì."
                break;
            case "79":
                message = "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch"
                break;
            default: message = "Lỗi"
        }

        if(secureHash === signed){
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            res.status(200).json({message})
        } else{
            res.status(400).json({code: '97'})
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


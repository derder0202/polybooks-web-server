// var userModel = require("../api_src/model/model");
//
const memberController = {
    listRegularMember: async (req,res)=>{
        // cần list đầy đủ của member thường
        res.render('regular_member/list_regular_member');
    },
    addRegularMember: async (req,res)=>{
       //xu ly add member
        //add xong
        // cần xử lý ... sau khi thêm xong về địa chỉ /members
        res.redirect('/members')
    },
    editRegularMember: async (req,res)=>{
        //xu ly add member
        //add xong
        res.redirect('/members')
    },

    //them sua xoa

}

module.exports = memberController
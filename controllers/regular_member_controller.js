// var userModel = require("../api_src/model/model");
//
const memberController = {
    listRegularMember: async (req,res)=>{
        // cần list đầy đủ của member thường
        res.render('regular_member/list_regular_member');
    },
    formAddRegularMember: async (req,res)=>{
        res.render('regular_member/add_regular_member');
    },
    formEditRegularMember: async (req,res)=>{
        res.render('regular_member/edit_regular_member');
    },
    formChangePassword: async (req,res)=>{
        res.render('regular_member/change_password');
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
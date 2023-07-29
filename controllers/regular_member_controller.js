const User = require("../api_src/model/model").User;
const memberController = {
    //Hiển thị toàn bộ list user
    listRegularMember: async (req,res)=>{
        try {
            const listUsers = await User.find({role : 0}).populate('address');
            res.render('regular_member/list_regular_member', { listUsers});
        } catch (error) {
            console.error(error);
            res.status(500).send('Lỗi khi lấy danh sách người dùng');
        }
    },
    formAddRegularMember: async (req,res)=>{
        res.render('regular_member/add_regular_member');
    },
    //hiển thị thông tin theo user
    formEditRegularMember: async (req,res)=>{
        console.log(req.params)
        let itemMember = await User.findById(req.params.id).populate('address')
            .exec()
            .catch(function (err){
                console.log(err);
            });
        console.log(itemMember)
        if (itemMember == null){
            res.send('Không tìm thấy bản ghi');
        }
        res.render('regular_member/edit_regular_member',{itemMember});
    },
    //logic post sửa thông tin user
    postEditRegularMember: async (req,res)=>{
        try {
            console.log(req.body);
            const dieu_kien = {
              _id: req.params.id
            };
            const du_lieu = {
              fullName: req.body.member_name,
              email: req.body.member_email,
              role: Number(req.body.member_role),
              gender: req.body.member_gender,
              birthday: new Date(req.body.member_birthday)
            };
        
            await User.updateOne(dieu_kien, du_lieu);
            res.redirect('/RegularMembers');
          } catch (error) {
            res.send("Lỗi cập nhật: " + error.message);
          }
    },
    formChangePassword: async (req,res)=>{
        res.render('regular_member/change_password');
    },
    addRegularMember: async (req,res)=>{
        try {
        const fullName = req.body.inputUsername;
        const phone = req.body.phoneNumber;
        const plainPassword = req.body.password;
        const email = req.body.email;
        const gender = req.body.gender;
        const role = req.body.role;
        const birthday = req.body.inputBirthday
        // Mã hóa mật khẩu
        const base64Password = Buffer.from(plainPassword).toString('base64');

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            // If a user with the same phone number exists, send a message
            return res.send("Số điện thoại đã được đăng ký cho người dùng khác. Vui lòng sử dụng số điện thoại khác.");
        }

        const newUser = new User({
            fullName,
            phone,
            password: base64Password,
            email,
            gender,
            role,
            birthday
        });
        await newUser.save();
        res.redirect('/RegularMembers');
    } catch (error) {
        res.send("Lỗi khi thêm người dùng: " + error.message);
        }
    }
}

module.exports = memberController
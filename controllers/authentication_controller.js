const authenticationController = {
    formLogin: async (req,res)=>{
        // cần list đầy đủ của member thường
        res.render('authentication/login-page');
    },
}
module.exports = authenticationController
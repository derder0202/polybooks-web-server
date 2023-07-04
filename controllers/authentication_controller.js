const authenticationController = {
    formLogin: async (req,res)=>{
        // cần list đầy đủ của member thường
        if (req.isAuthenticated()) {
            res.redirect('/Statistical');
        }
        else{
            res.render('authentication/login-page')
        }
        //res.render('authentication/login-page');
    },


}
module.exports = authenticationController
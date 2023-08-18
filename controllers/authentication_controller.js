const authenticationController = {
    formLogin: async (req,res)=>{
        if (req.isAuthenticated()) {
            res.redirect('/Statistical');
        }
        else{

            res.render('authentication/login-page',)
        }
    },
}
module.exports = authenticationController
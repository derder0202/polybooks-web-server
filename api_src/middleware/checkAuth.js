function checkAuth(req, res, next) {
    if(req.isUnauthenticated()){
        return res.redirect('/Login')
    }
    next()
}
module.exports = checkAuth
const jwt = require("jsonwebtoken");

function authenToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).send('Unauthorized');
        return;
    }
    const idToken = authHeader.split(' ')[1];

    if (!idToken) return res.sendStatus(401)

    try {
        const user = jwt.verify(idToken, process.env.ACCESS_TOKEN_SECRET)
        if(user.active === false){
            return res.status(400).json("Tai khoan da bi khoa")
        } else {
            req.user = user
            next();
        }
    } catch (e) {
        return res.sendStatus(403)
    }
}
module.exports = authenToken
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
        jwt.verify(idToken, process.env.ACCESS_TOKEN_SECRET)
        next();
    } catch (e) {
        return res.sendStatus(403)
    }
}
module.exports = authenToken
function authMiddleware(req, res, next) {
    const admin = require('firebase-admin');
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).send('Unauthorized');
        return;
    }

    const idToken = authHeader.split(' ')[1];
    admin.auth().verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            next();
        })
        .catch(error => {
            console.error('Error while verifying Firebase ID token:', error);
            res.status(401).send('Unauthorized');
        });
}
module.exports = authMiddleware
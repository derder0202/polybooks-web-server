const multer = require("multer");
const UploadImg = multer({
    storage: multer.memoryStorage(),
    fileFilter(req, file, cb) {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG and PNG image files are allowed.'));
        }
    }
});
module.exports = UploadImg
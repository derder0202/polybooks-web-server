
// user router
const express = require('express');
const router = express.Router();
const userController = require('../controller/user_controller');

const authMiddleware = require("../middleware/authMiddleware");
const {Bill, User} = require("../model/model");
// GET /users
router.post('/filter', userController.getUsers);

router.post('/login', userController.login);

router.get('/test',async (req,res)=>{
    User.calculateRolePercentage().then((result,err)=>{
        if (err) {
            console.log(err);
        } else {
            const totalUsers = result.reduce((total, item) => total + item.count, 0);
            result.forEach(item => {
                const percentage = (item.count / totalUsers) * 100;
                console.log(`Phần trăm người dùng có vai trò ${item.role}: ${percentage}%`);
            });
        }
    })
});
// GET /users/:id
router.get('/:id', userController.getUserById);
// POST /users
router.post('/', userController.createUser);
// PUT /users/:id
router.put('/:id', userController.updateUser);
// DELETE /users/:id
router.delete('/:id', userController.deleteUser);

router.post('/checkPhoneNumber', userController.checkPhoneNumber);
router.post('/changePasswordByPhone', userController.changePasswordByPhone);

//add to favorite
router.post('/:id/addToFavorite', userController.addToFavorite);
router.post('/:id/removeFromFavorite', userController.removeFromFavorite);
router.get('/:id/favorite', userController.getFavoriteByUser);

//address
router.get('/:id/address', userController.getAddressByUser);
router.post('/:id/addAddress', userController.addAddress);
router.post('/:id/removeAddress', userController.removeAddress);

router.get('/:id/posts', userController.getPostsByUser);
router.get('/:id/reviews', userController.getReviewsByUser);
router.get('/:id/notification', userController.getNotificationsByUser);
router.get('/:id/buyBills', userController.getBuyBillsByUser);
router.get('/:id/sellBills', userController.getSellBillsByUser);

//const multer = require('multer')
// const upload = multer({
//     storage: multer.memoryStorage(),
//     fileFilter(req, file, cb) {
//         const allowedMimeTypes = ['image/jpeg', 'image/png'];
//         if (allowedMimeTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Invalid file type. Only JPEG and PNG image files are allowed.'));
//         }
//     }
// });
//
// const upload = require("../upload_image")
// router.post('/test',upload.array("images",4),async (req,res)=>{
//     const files = req.files;
//     console.log(req.files.length)
//     const bucket = admin.storage().bucket()
//     const uploadPromises = files.map(file => {
//         const options = {
//             destination: `images/${file.originalname}`, // set the destination path in the bucket
//             metadata: {
//                 contentType: file.mimetype, // set the MIME type of the file
//             },
//         };
//         const blob = bucket.file(options.destination); // create a reference to the file in the bucket
//         const blobStream = blob.createWriteStream(options); // create a write stream to upload the file
//         blobStream.end(file.buffer); // write the buffer to the stream
//         return new Promise( (resolve, reject) => {
//             blobStream.on('finish', async() => {
//                 await blob.makePublic();
//                 const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`; // get the public URL of the uploaded file
//                 resolve(publicUrl);
//             });
//             blobStream.on('error', reject);
//         });
//     });
//     const results = await Promise.all(uploadPromises);
//     console.log(results); // log the public URLs of the uploaded files
//     res.status(200).send(`${files.length} files uploaded successfully.`);
//
// })
//
//router.post('/testAccess',async (req,res)=>{
    // await admin.auth().send("mr73367@gmail.com").then((link)=>{
    //
    //     console.log(`Password reset link generated: ${link}`);
    //     res.status(200).json("sent")
    // })
//})
//
// router.post('/testToken',async (req,res)=>{
//     let uid;
//     const admin = require('firebase-admin');
//     await admin.auth().createUser({
//         email:"mr73367@gmail.com",
//         password: "123456",
//     }).then(userCredential =>{
//         admin.auth().createCustomToken(userCredential.uid)
//             .then(token => {
//                 console.log(token)
//             })
//     })
//


    // await getAuth().createUserWithEmailAndPassword("mr73367@gmail.com", "123456")
    //     .then((userCredential)=>{
    //         const user = userCredential.user
    //         const idToken = user.getIdToken()
    //         console.log(idToken)
    //     })


//})

module.exports = router;
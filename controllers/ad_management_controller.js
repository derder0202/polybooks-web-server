const {User} = require("../api_src/model/model");
const multer = require("multer");
const admin = require("firebase-admin");
const Banner = require("../api_src/model/model").Banner;

const adManagementController = {
    //lay ra list banner
    listBannerManagement: async (req,res)=>{
        try {
            const listBanner = await Banner.find({isActive : false});
            res.render('advertisement/ad_management',{listBanner})

        } catch (e) {
            console.error(e);
            res.status(500).send('Lỗi khi lấy danh sách banner');

        }
    },

    //sưa thong tin banner
    editBannerManagement: async (req,res) =>{
        let editBanner = await Banner.findById(req.params.id)
            .exec()
            .catch(function (err) {
                console.log(err)
            });
        console.log(editBanner)
        if (editBanner == null){
            res.send('Không tìm thấy bản ghi');
        }
        res.render('advertisement/edit_banner',{editBanner})

        // res.render('advertisement/edit_banner')

    },
    postEditBanner: async (req,res)=>{
        try {
            const detailBanner = await Banner.findById(req.params.id);
        
            if (!detailBanner) {
              return res.send('Không tìm thấy bản ghi');
            }
        
            if (req.body.action === 'addbanner') {
                detailBanner.isActive = true;
            } else if (req.body.action === 'nobanner') {
                detailBanner.postStatus = false;
            }
        
            await detailBanner.save();
        
            console.log('Thông tin được thay đổi:', detailBanner);
            res.redirect('/AdvertisingManagement');
          } catch (err) {
            console.error(err);
            res.status(500).send('Đã xảy ra lỗi server');
        }
    },

    // Them moi banner
    // formAddNewBanner: async (req,res)=>{
    //     res.render('advertisement/add_new_banner')
    // },
    // addNewBannerManagement:async (req,res) =>{
    //     // try {
    //     //     const dieu_kien = {
    //     //         _id: req.params.id
    //     //     };
    //     //     const du_lieu = {
    //     //         userId: req.body.userId_banner,
    //     //         content: req.body.content_banner,
    //     //         isActive: Boolean(req.body.isActive_banner),
    //     //         image: req.body.image_banner,
    //     //
    //     //     };
    //     //     await Banner.create(dieu_kien,du_lieu);
    //     //     res.redirect('/AdvertisingManagement');
    //     // }catch (error) {
    //     //     res.send("Lỗi tạo mới banner: " + error.message);
    //     // }
    //
    //     const {userId_banner,isActive_banner,content_banner,image_banner} = await req.body;
    //
    //    await Banner.create({
    //         userId: userId_banner,
    //         isActive: Boolean(isActive_banner),
    //         content : content_banner,
    //         image : image_banner,
    //     }).catch(error => console.log(error) );
    //
    //     res.redirect('/AdvertisingManagement');
    //
    //
    // }

    // postAddNewBanner : async (req,res) =>{
    //     console.log(req.body);
    //     const banner = new Banner({
    //         // userId: req.body.userId_banner,
    //         content: req.body.content_banner,
    //         isActive: Boolean(req.body.isActive_banner),
    //         // image: req.body.image_banner,
    //     });
    //     banner.save(function (err) {
    //         if(err){
    //             console.log(err)
    //         }else {
    //             console.log("Them thanh cong")
    //         }
    //     });
    //     res.redirect('/AdvertisingManagement')
    // },
    // createBanner: async (req, res) => {
    //     try {
    //         upload(req, res, async function (err) {
    //             if (err instanceof multer.MulterError) {
    //                 // A Multer error occurred when uploading.
    //             } else if (err) {
    //                 // An unknown error occurred when uploading.
    //             }
    //             const newBanner = new Banner(req.body);
    //             const file = req.file;
    //             if (file){
    //                 const bucket = admin.storage().bucket()
    //                 const options = {
    //                     destination: `banners/${newBanner._id}`, // set the destination path in the bucket
    //                     metadata: {
    //                         contentType: 'image/jpeg', // set the MIME type of the file
    //                     },
    //                 };
    //                 const blob = bucket.file(options.destination); // create a reference to the file in the bucket
    //                 const blobStream = blob.createWriteStream(options); // create a write stream to upload the file
    //                 blobStream.end(file.buffer); // write the buffer to the stream
    //                 return new Promise( (resolve, reject) => {
    //                     blobStream.on('finish', async() => {
    //                         await blob.makePublic();
    //                         const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`; // get the public URL of the uploaded file
    //                         resolve(publicUrl);
    //                         newBanner.image = publicUrl
    //                         await newBanner.save()
    //                         res.status(200).json(newBanner);
    //                     });
    //                     blobStream.on('error', reject);
    //                 });
    //             } else {
    //                 res.redirect('/AdvertisingManagement');
    //             }
    //             // Everything went fine.
    //         })
    //     } catch (error) {
    //         res.status(500).json({ message: 'Error creating banner', error });
    //     }
    // },


    // detailManagement: async (req,res)=>{
    //     // cần list đầy đủ của member thường
    //     res.render('advertisement/banner_details');
    // },
}

module.exports = adManagementController
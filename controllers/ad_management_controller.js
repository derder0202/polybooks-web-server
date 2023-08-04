const multer = require("multer");
const admin = require("firebase-admin");
const upload = require("../api_src/upload_image").single("image");
const {Banner,User} = require("../api_src/model/model");

const adManagementController = {
    //lay ra list banner
    listBannerManagement: async (req,res)=>{
        try {
            const listBanner = await Banner.find();
            res.render('advertisement/ad_management',{listBanner})

        } catch (e) {
            console.error(e);
            res.status(500).send('Lỗi khi lấy danh sách banner');

        }
    },
    getformbanner: async (req,res)=>{
        res.render('advertisement/add_new_banner')
    },
    postAddBanner: async (req,res)=>{
        console.log(req.body);
        try {
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                } else if (err) {
                    // An unknown error occurred when uploading.
                }
                    const { name, phone, address, link, image, description, endTime, price, createUser } = req.body;
                    const newBanner = new Banner({
                        name,
                        phone,
                        address,
                        link,
                        image,
                        description,
                        endTime,
                        price,
                        createUser,
                    });
                const file = req.file;
                if (file){
                    const bucket = admin.storage().bucket()
                    const options = {
                        destination: `banners/${newBanner._id}`, // set the destination path in the bucket
                        metadata: {
                            contentType: 'image/jpeg', // set the MIME type of the file
                        },
                    };
                    const blob = bucket.file(options.destination); // create a reference to the file in the bucket
                    const blobStream = blob.createWriteStream(options); // create a write stream to upload the file
                    blobStream.end(file.buffer); // write the buffer to the stream
                    return new Promise( (resolve, reject) => {
                        blobStream.on('finish', async() => {
                            await blob.makePublic();
                            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`; // get the public URL of the uploaded file
                            resolve(publicUrl);
                            newBanner.image = publicUrl
                            await newBanner.save()
                            res.redirect('/AdvertisingManagement');
                        });
                        blobStream.on('error', reject);
                    });
                } else {
                    res.status(404).json({ message: 'file not found' });
                }
                
                // Everything went fine.
            });
        } catch (error) {
            res.status(500).json({ message: 'Error creating banner', error });
        }
    }
}

module.exports = {adManagementController,upload}
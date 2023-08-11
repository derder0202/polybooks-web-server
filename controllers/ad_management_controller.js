const multer = require("multer");
const admin = require("firebase-admin");
const upload = require("../api_src/upload_image").single("image");
const {Banner,User,Post,Report,WithdrawRequest} = require("../api_src/model/model");

const adManagementController = {
    //lay ra list banner
    listBannerManagement: async (req,res)=>{
        try {
            const listBanner = await Banner.find({isActive:true}).populate('createUser');
            const listBook = await Post.find({postStatus : 0});
            const listReport = await Report.find({status : 0});
            const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
            const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length;
            const userName = req.user.fullName;
            const userEmail = req.user.email
            res.render('advertisement/ad_management',
            {
                partials: {
                    nav_header: 'partials/nav_header'
                },
                listBanner,
                userName,
                userEmail,
                listBook,
                totalItemCount,
                listBrowsewithdrawals,
                listReport,

            })
        } catch (e) {
            console.error(e);
            res.status(500).send('Lỗi khi lấy danh sách banner');

        }
    },
    detailBanner: async (req,res)=>{
        let detailBanners = await Banner.findById(req.params.id).populate('createUser')
            .exec()
            .catch(function (err) {
                console.log(err)
            });
        console.log(detailBanners)
        if (detailBanners == null){
            res.send('Không tìm thấy bản ghi');
        }
        const userName = req.user.fullName;
        const userEmail = req.user.email;
        const listBook = await Post.find({postStatus : 0});
        const listReport = await Report.find({status : 0});
        const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
        const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length;
        res.render('advertisement/banner_details',{
            partials: {
                nav_header: 'partials/nav_header'
            },
            detailBanners,
            userName,
            userEmail,
            listBook,
            totalItemCount,
            listBrowsewithdrawals,
            listReport,
        });
    },
    getformbanner: async (req,res)=>{
        const userId = req.user._id;
        const userName = req.user.fullName;
        const userEmail = req.user.email
        const listBook = await Post.find({postStatus : 0});
        const listReport = await Report.find({status : 0});
        const listBrowsewithdrawals = await WithdrawRequest.find({status: 0});
        const totalItemCount = listBook.length + listReport.length + listBrowsewithdrawals.length;
        res.render('advertisement/add_new_banner',{
            partials: {
                nav_header: 'partials/nav_header'
            },
            userId,
            userName,
            userEmail,
            listBook,
            totalItemCount,
            listBrowsewithdrawals,
            listReport,
        })
    },
    postAddBanner: async (req,res)=>{
        const { name, phone, address,image,isActive, link, description, endTime, price} = req.body;
            const newBanner = new Banner({
                name,
                phone,
                address,
                link,
                image,
                isActive,
                description,
                endTime,
                price,
                createUser:req.user._id,
            });
        try {
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                } else if (err) {
                    // An unknown error occurred when uploading.
                }
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
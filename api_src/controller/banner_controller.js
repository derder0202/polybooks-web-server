const { Banner, User} = require("../model/model");
const multer = require("multer")
const admin = require("firebase-admin");
const upload = require("../upload_image").single("image");
const bannerController = {
    getBanners: async (req, res) => {
        try {
            const startIndex = parseInt(req.query.startIndex) || 0;
            const limit = parseInt(req.query.limit) || 20;
            const banners = await Banner.find({isActive:true})
                .skip(startIndex)
                .limit(limit);
            res.status(200).json(banners);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error getting banners from database.' });
        }
    },
    getBannerById: async (req, res) => {
        try {
            const banner = await Banner.findById(req.params.id);
            if (!banner) {
                res.status(404).json({ error: 'Banner not found.' });
            } else {
                res.status(200).json(banner);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error getting banner from database.' });
        }
    },
    createBanner: async (req, res) => {
        try {
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                } else if (err) {
                    // An unknown error occurred when uploading.
                }
                const newBanner = new Banner(req.body);
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
                            res.status(200).json(newBanner);
                        });
                        blobStream.on('error', reject);
                    });
                } else {
                    res.status(404).json({ message: 'file not found' });
                }
                // Everything went fine.
            })
        } catch (error) {
            res.status(500).json({ message: 'Error creating banner', error });
        }
    },
    updateBannerById : async (req, res) => {
        const { id } = req.params;

        try {
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                } else if (err) {
                    // An unknown error occurred when uploading.
                }
                const banner = await Banner.findById(id);
                const file = req.file;
                if(file){
                    const bucket = admin.storage().bucket()
                    const options = {
                        destination: `banners/${banner._id}`, // set the destination path in the bucket
                        metadata: {
                            contentType: 'image/jpeg', // set the MIME type of the file
                        },
                        overwrite: true
                    };
                    const blob = bucket.file(options.destination); // create a reference to the file in the bucket
                    const blobStream = blob.createWriteStream(options); // create a write stream to upload the file
                    blobStream.end(file.buffer); // write the buffer to the stream
                    return new Promise( (resolve, reject) => {
                        blobStream.on('finish', async() => {
                            //const blob = bucket.file(options.destination);
                            const config = {
                                action: 'read',
                                expires: '03-17-3025', // set the expiration date of the URL
                            };
                            const [url] = await blob.getSignedUrl(config);
                            resolve(url);
                            await banner.updateOne({image:url,...req.body});
                            return res.status(200).json({message: "banner updated"});
                            // newUser.avatar = publicUrl
                            // await newUser.save()
                            //res.status(201).json(newUser);
                        });
                        blobStream.on('error', reject);
                    });
                } else {
                    const updateBanner = await Banner.findByIdAndUpdate(id,req.body, {new:true})
                    res.status(200).json({message: "banner updated", data: updateBanner});
                }

                // Everything went fine.
            })

        } catch (error) {
            res.status(500).json({ message: 'Error updating banner', error });
        }
    },
    deleteBannerById: async (req, res) => {
        try {
            const banner = await Banner.findByIdAndDelete(req.params.id);
            const bucket = admin.storage().bucket();
            await bucket.file("banners/"+banner._id).delete()
            if (!banner) {
                res.status(404).json({ error: 'Banner not found.' });
            } else {
                res.status(200).json({message: "banner is deleted"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting banner from database.' });
        }
    },
}
 module.exports = bannerController;
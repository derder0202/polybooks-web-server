const {Shop, Category, User} = require("../model/model");
const multer = require("multer")
const admin = require("firebase-admin");
const upload = require("../upload_image").single("image");

const shopController = {
    getShops: async (req, res) => {
        try {
            const startIndex = parseInt(req.query.startIndex) || 0;
            const limit = parseInt(req.query.limit) || 20;
            const shops = await Shop.find({})
                .skip(startIndex)
                .limit(limit);
            res.status(200).json(shops);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error getting categories from database.' });
        }
    },

    createShop : async (req, res) => {
        try {
            // const { user, name, description, address,phone} = req.body;
            // const shop = new Shop({ user, address, phone, name,description });

            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                } else if (err) {
                    // An unknown error occurred when uploading.
                }
                const newShop = new Shop(req.body);

                const file = req.file;
                if(file){
                    const bucket = admin.storage().bucket()
                    const options = {
                        destination: `shops/${newShop._id}`, // set the destination path in the bucket
                        metadata: {
                            contentType: 'image/jpeg', // set the MIME type of the file
                        },
                    };
                    const blob = bucket.file(options.destination); // create a reference to the file in the bucket
                    const blobStream = blob.createWriteStream(options); // create a write stream to upload the file
                    blobStream.end(file.buffer); // write the buffer to the stream
                    return new Promise((resolve, reject) => {
                        blobStream.on('finish', async () => {
                            await blob.makePublic();
                            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`; // get the public URL of the uploaded file
                            resolve(publicUrl);
                            newShop.image = publicUrl
                            await newShop.save()
                            res.status(200).json(newShop);
                        });
                        blobStream.on('error', reject);
                    })
                } else {
                    res.status(404).json({ error: "file not found" });
                }
                // Everything went fine.
            })

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getShopById : async (req, res) => {
        try {
            const id = req.params.id;
            const shop = await Shop.findById(id);
            if (!shop) {
                return res.status(404).json({ error: 'Shop not found' });
            }
            res.json({ shop });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateShop : async (req, res) => {
        try {
            const id = req.params.id;
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                } else if (err) {
                    // An unknown error occurred when uploading.
                }
                const shop = await Shop.findById(id);
                const file = req.file;
                if(file){
                    const bucket = admin.storage().bucket()
                    const options = {
                        destination: `shops/${shop._id}`, // set the destination path in the bucket
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
                            await shop.updateOne({avatar:publicUrl,...req.body});
                            return res.status(200).json({message: "user updated"});
                            // newUser.avatar = publicUrl
                            // await newUser.save()
                            //res.status(201).json(newUser);
                        });
                        blobStream.on('error', reject);
                    });
                } else {
                    const updateShop = await User.findByIdAndUpdate(id,req.body, {new:true})
                    res.status(200).json({message: "user updated", data: updateShop});
                }

                // Everything went fine.
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteShop : async (req, res) => {
        try {
            const shop = await Shop.findByIdAndDelete(req.params.id);
            const bucket = admin.storage().bucket();
            await bucket.file("shops/"+shop._id).delete()
            if (!shop) {
                res.status(404).json({ error: 'Category not found.' });
            } else {
                res.status(200).json({message: "category is deleted"});
            }

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getReviewsByShop : async (req, res) => {
        try {
            const shop = await Shop.findById(req.params.id).populate('reviews');
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
            res.json(shop.reviews);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    getPostsByShop : async (req, res) => {
        try {
            const shop = await Shop.findById(req.params.id).populate('posts');
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }
            res.json(shop.posts);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    }


}

module.exports = shopController
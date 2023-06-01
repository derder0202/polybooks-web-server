const {User} = require("../model/model");
const multer = require("multer")
const admin = require("firebase-admin");
const upload = require("../upload_image").single("avatar");


const userController = {
    getUsers : async (req, res) => {
        try {
            // Extract query parameters from request body
            const { uid, fullName, phone, startIndex = 0, limit = 20 } = req.body;

            // Create filter object based on queryo parameters
            // 1 ui//2 filter(tham s)
            const filter = {};
            if (uid) filter.uid = uid;
            if (fullName) filter.fullName = fullName;
            if (phone) filter.phone = phone;
            // Retrieve users from database with filtering and pagination
            const users = await User.find(filter).skip(Number(startIndex)).limit(Number(limit));
            res.status(200).json(users);
            // Send response with users as JSON

        } catch (error) {
            // Send error response with appropriate status code and message
            res.status(500).json({ message: 'Error getting users', error });
        }
    },
    getUserById : async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findOne({uid: id});
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error getting user', error });
        }
    },
    createUser : async (req, res) => {
        try {
            // upload(req, res, async function (err) {
            //     if (err instanceof multer.MulterError) {
            //         // A Multer error occurred when uploading.
            //     } else if (err) {
            //         // An unknown error occurred when uploading.
            //     }
            //     const newUser = new User(req.body);
            //
            //     const file = req.file;
            //     const bucket = admin.storage().bucket()
            //     const options = {
            //         destination: `users/${newUser._id}`, // set the destination path in the bucket
            //         metadata: {
            //             contentType: 'image/jpeg', // set the MIME type of the file
            //         },
            //     };
            //     const blob = bucket.file(options.destination); // create a reference to the file in the bucket
            //     const blobStream = blob.createWriteStream(options); // create a write stream to upload the file
            //     blobStream.end(file.buffer); // write the buffer to the stream
            //     return new Promise( (resolve, reject) => {
            //         blobStream.on('finish', async() => {
            //             await blob.makePublic();
            //                 const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`; // get the public URL of the uploaded file
            //             resolve(publicUrl);
            //             newUser.avatar = publicUrl
            //             await newUser.save()
            //             res.status(201).json(newUser);
            //         });
            //         blobStream.on('error', reject);
            //     });
            //     // Everything went fine.
            // })
            const newUser = new User(req.body);
            const saveUser = await newUser.save()
            res.status(200).json(saveUser)

        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error });
        }
    },
    updateUser : async (req, res) => {
        const { id } = req.params;

        try {
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                } else if (err) {
                    // An unknown error occurred when uploading.
                }
                const user = await User.findById(id);
                const file = req.file;
                if(file){
                    const bucket = admin.storage().bucket()
                    const options = {
                        destination: `users/${user._id}`, // set the destination path in the bucket
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
                            await user.updateOne({avatar:publicUrl,...req.body});
                            return res.status(200).json({message: "user updated"});
                            // newUser.avatar = publicUrl
                            // await newUser.save()
                            //res.status(201).json(newUser);
                        });
                        blobStream.on('error', reject);
                    });
                } else {
                    const updatedUser = await User.findByIdAndUpdate(id,req.body, {new:true})
                    res.status(200).json({message: "user updated", data: updatedUser});
                }

                // Everything went fine.
            })

        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error });
        }
    },

    //disable account
    deleteUser : async (req, res) => {
        const { id } = req.params;
        try {
            const user = User.findById(id)
            await admin.auth().updateUser(user.uid,{
                disabled:true
            })
            res.status(204).json({
                message: `account with uid(${user.uid}) is disabled`
            })
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error })
        }
    },
    addToFavorite: async function(req, res) {
        const postId = req.body.postId;
        const userId = req.params.id;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
            if(user.favorite.includes(postId)){
                return res.status(400).json({message: "you had added this post to favorite"})
            }
            user.favorite.push(postId);
            await user.save();
            return res.status(200).json({ message: "Post added to favorites"});

        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },

    removeFromFavorite: async function(req, res) {
        const postId = req.body.postId;
        const userId = req.params.id;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if(!user.favorite.includes(postId)){
                return res.status(400).json({ message: "this post is not in favorite of this user"});
            }
            user.favorite.pull(postId);
            await user.save();
            return res.status(200).json({ message: "Post removed from favorites" });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },
}

module.exports = userController
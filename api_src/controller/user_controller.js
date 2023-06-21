const {User} = require("../model/model");
const multer = require("multer")
const admin = require("firebase-admin");
const upload = require("../upload_image").single("avatar");


const userController = {
    getUsers : async (req, res) => {
        try {
            // Extract query parameters from request body
            const { fullName, phone, startIndex = 0, limit = 20 } = req.body;

            // Create filter object based on queryo parameters
            // 1 ui//2 filter(tham s)
            const filter = {};
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
            const user = await User.findById(id);
            if(user){
                res.status(200).json(user);
            } else {
                res.status(404).json({message: "user is not exists"})
            }

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
                            await user.updateOne({avatar:url,...req.body});
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

    login : async (req, res) => {
        try {
            const {phone,password} = req.body
            //console.log(req.body)
            const user = await  User.findOne({phone})
            //console.log(atob(user.password))

            if(user){
                if(btoa(password) === user.password){
                    res.status(200).json({message:"Đăng nhập thành công", data: user})
                } else {
                    res.status(404).json({message: "Sai mật khẩu"})
                }
            } else {
                res.status(404).json({message: "Số điện thoại không tồn tại"})
            }
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error })
        }
    },

    changePasswordByPhone : async (req, res) => {
        const { phone, newPassword } = req.body;
        const user = await User.findOne(phone);

        // Check if the current password matches the password in the database
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    },


    checkPhoneNumber : async (req, res) => {
        try {
            console.log(req.body.phone)
            const user = await User.findOne({phone:req.body.phone})
            if(user){
                res.status(200).json(true)
            } else {
                res.status(200).json(false)
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error })
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
            res.status(200).json({
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
                return res.status(404).json({ message: "User not found" });
            }
            if(user.favorite.includes(postId)){
                return res.status(404).json({message: "you had added this post to favorite"})
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
                return res.status(404).json({ message: "this post is not in favorite of this user"});
            }
            user.favorite.pull(postId);
            await user.save();
            return res.status(200).json({ message: "Post removed from favorites" });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },
    getPostsByUser : async (req, res) => {
        const { startIndex, limit } = req.query;
        //const { userId } = req.params;
        try {
            const user = await User.findById(req.params.id).populate({
                path: 'posts',
                options: { skip: parseInt(startIndex) || 0, limit: parseInt(limit) ||20}
            });
            console.log(user)
            res.status(200).json(user.posts);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },
    getFavoriteByUser : async (req, res) => {
        const { startIndex, limit } = req.query;
        //const { userId } = req.body;
        try {
            const user = await User.findById(req.params.id).populate({
                path: 'favorite',
                options: { skip: parseInt(startIndex) || 0,
                    limit: parseInt(limit) || 20
                }
            });
            res.status(200).json(user.favorite);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },
    getReviewsByUser : async (req, res) => {
        const { startIndex, limit } = req.query;
       // const { userId } = req.body;
        try {
            const user = await User.findById(req.params.id).populate({
                path: 'reviews',
                options: { skip: parseInt(startIndex) ||0, limit: parseInt(limit) || 20 }
            });
            res.status(200).json(user.reviews);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },
    getNotificationsByUser : async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId).populate('notifications');
            return res.status(200).json(user.notifications);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server error');
        }
    }
}

module.exports = userController
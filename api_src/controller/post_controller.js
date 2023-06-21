const {Category, Publisher, User, Post, Author, Shop} = require("../model/model");
const multer = require("multer");
const admin = require("firebase-admin");

const upload = require('../upload_image').array("multiImage",4)

const postController = {
    getPosts: async (req, res) => {
        try {
            const posts = await Post.find()
                .populate('category', 'name')
                .populate('publisher', 'name')
                .populate('author', 'name')
                .populate('seller', 'fullName');
            res.status(200).json(posts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getPostsWithFilter: async (req, res) => {
        const { bookName, authorName, publisherName, category, startIndex=0, limit=20} = req.body;
        let filter = {}
        if(bookName){
            filter.bookName = { $regex: new RegExp(bookName, 'i') }
        }
        if(authorName){
            const authors  = await Author.find({name: { $regex: new RegExp(authorName, 'i') }}).select("_id")
            filter.author = { $in : authors.map(e => e._id) }
        }
        if(publisherName){
            const publishers  = await Publisher.find({name: { $regex: new RegExp(publisherName, 'i') }}).select("_id")
            filter.publisher = { $in : publishers.map(e => e._id) }
        }
        if(category){
            filter.category = category
        }
        try {
            const posts = await Post.find(filter)
                .populate('category', 'name')
                .populate('publisher', 'name')
                .populate('author', 'name')
                .populate('seller', 'fullName')
                .select("-__v")
                .skip(startIndex)
                .limit(limit)
                .exec();
            res.status(200).json(posts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getPostById: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
                .populate('category', 'name')
                .populate('publisher', 'name')
                .populate('seller', 'fullName');
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    createPost: async (req, res) => {
        try {
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                } else if (err) {
                    // An unknown error occurred when uploading.
                }
                const { bookName, postTitle, description, price, bookStatus, bookSize, language,authorName, category, publisherName, totalPage , seller,shopId} = req.body;
                const post = new Post({ bookName, postTitle, description,category, price, bookStatus, bookSize, language, totalPage, seller,shopId });
                if(seller){
                    await User.findByIdAndUpdate(seller,{$push:{posts: post._id}})
                }
                if(shopId){
                    await Shop.findByIdAndUpdate(shopId,{$push:{posts: post._id}})
                }
                if(authorName){
                    const authorTemp = await Author.findOne({name:authorName})
                    if(authorTemp){
                        post.author = authorTemp._id
                        if(!authorTemp.posts.includes(post._id)){
                            await authorTemp.updateOne({$push:{posts: post._id}})
                        }
                    } else {
                        const newAuthor = new Author({name:authorName})
                        newAuthor.posts = [post._id]
                        await  newAuthor.save()
                        post.author = newAuthor._id
                    }
                }
                if(category){
                    const categoryTemp = await  Category.findById(category)
                    if(categoryTemp){
                        if(!categoryTemp.posts.includes(post._id) ){
                            await categoryTemp.updateOne({$push:{posts: post._id}})
                        }
                    }

                }
                if(publisherName){
                    const publisherTemp = await Publisher.findOne({name:publisherName})
                    if(publisherTemp){
                        post.publisher = publisherTemp._id
                        if(!publisherTemp.posts.includes(post._id)){
                            await publisherTemp.updateOne({$push:{posts: post._id}})
                        }
                    } else {
                        const newPublisher = new  Publisher({name:publisherName})
                        newPublisher.posts = [post._id]
                        newPublisher.save()
                        post.publisher = newPublisher._id
                    }
                }
                const files = req.files;
                if(files.length !== 0){
                    const bucket = admin.storage().bucket()
                    const uploadPromises = files.map((file,index) => {
                        const options = {
                            //destination: `posts/${post._id}/${file.originalname}`, // set the destination path in the bucket
                            destination: `posts/${post._id}/${index}`,
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
                            });
                            blobStream.on('error', reject);
                        });
                    });
                    post.images = await Promise.all(uploadPromises)
                    //console.log(results); // log the public URLs of the uploaded files
                    //const seller = req.user._id;

                    Object.assign(post, req.body)
                    const savedPost = await post.save();
                    res.status(200).json(savedPost);
                } else {
                    // res.status(500).json("you have to add images")
                    console.log(authorName)
                    Object.assign(post, req.body)
                    const savedPost = await post.save();
                    res.status(200).json(savedPost);
                }

                // Everything went fine.

            })



        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },


    updatePost: async (req, res) => {
        try {
            //const { bookName, postTitle, description, price, images, bookStatus, bookSize, language, category, publisher, totalPage,seller } = req.body;
            let post = await Post.findById(req.params.id);
            const {category, authorName,  publisherName} = req.body;
            const bucket = admin.storage().bucket();
            await bucket.deleteFiles({
                prefix: "posts/"+post._id,
            });
            if(authorName){
                const authorTemp = await Author.findOne({name:authorName})
                if(authorTemp){
                    post.author = authorTemp._id
                    if(!authorTemp.posts.includes(post._id)){
                        await authorTemp.updateOne({$push:{posts: post._id}})
                    }
                } else {
                    const newAuthor = new Author({name:authorName})
                    newAuthor.posts = [post._id]
                    await  newAuthor.save()
                    post.author = newAuthor._id
                }
            }
            if(category){
                const categoryTemp = await  Category.findById(category)
                if(!categoryTemp.posts.includes(post._id)){
                    await categoryTemp.updateOne({$push:{posts: post._id}})
                }
            }
            if(publisherName){
                const publisherTemp = await Publisher.findOne({name:publisherName})
                if(publisherTemp){
                    post.publisher = publisherTemp._id
                    if(!publisherTemp.posts.includes(post._id)){
                        await publisherTemp.updateOne({$push:{posts: post._id}})
                    }
                } else {
                    const newPublisher = new  Publisher({name:publisherName})
                    newPublisher.posts = [post._id]
                    newPublisher.save()
                    post.publisher = newPublisher._id
                }
            }
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                } else if (err) {
                    // An unknown error occurred when uploading.
                }
                const files = req.files;
                if(files){
                    //const post = new Post({ bookName, postTitle, description,category, price, bookStatus, bookSize, language, totalPage, seller });
                    //const bucket = admin.storage().bucket()
                    const uploadPromises = files.map((file,index) => {
                        const options = {
                            //destination: `posts/${post._id}/${file.originalname}`, // set the destination path in the bucket
                            destination: `posts/${post._id}/${index}`,
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
                            });
                            blobStream.on('error', reject);
                        });
                    });
                    post.images = await Promise.all(uploadPromises)

                    //post.addAll(req.body)
                    Object.assign(post, req.body)
                    await post.save()
                    //const updatePost = await post.updateOne(req.body,{new:true})
                    //const savedPost = await post.save();
                    res.status(200).json({message: "post updated"});
                } else {
                    //console.log("day roi")
                    Object.assign(post, req.body)
                    await post.save()
                    res.status(200).json({message: "post updated"});
                }

                // Everything went fine.

            })
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    deletePost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (post) {
                if(post.seller){
                    await User.findByIdAndUpdate(post.seller,{$pull:{posts: post._id}})
                }
                if(post.category){
                    await Category.findByIdAndUpdate(post.category,{$pull:{posts: post._id}})
                }
                if(post.publisher){
                    await Publisher.findByIdAndUpdate(post.publisher,{$pull:{posts: post._id}})
                }
                const bucket = admin.storage().bucket();
                await bucket.deleteFiles({
                    prefix: "posts/"+post._id,
                });
                await post.deleteOne();

                res.status(200).json({message: "post deleted"});

            } else {
                res.status(404).json({ message: 'Post not found' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

}

module.exports = postController
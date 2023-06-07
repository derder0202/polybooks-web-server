const {Category} = require("../model/model");
const multer = require("multer")
const admin = require("firebase-admin");
const upload = require("../upload_image").single("image");
const categoryController = {
    getCategories: async (req, res) => {
        try {
            const startIndex = parseInt(req.query.startIndex) || 0;
            const limit = parseInt(req.query.limit) || 20;
            const categories = await Category.find({})
                .skip(startIndex)
                .limit(limit);
            res.status(200).json(categories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error getting categories from database.' });
        }
    },
    // Get category by id
    getCategoryById: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) {
                res.status(404).json({ error: 'Category not found.' });
            } else {
                res.status(200).json(category);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error getting category from database.' });
        }
    },
    // Create new category
    createCategory: async (req, res) => {
        try {
            upload(req, res, async function (err) {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                } else if (err) {
                    // An unknown error occurred when uploading.
                }
                const newCategory = new Category(req.body);

                const file = req.file;
                if (file){
                    const bucket = admin.storage().bucket()
                    const options = {
                        destination: `categories/${newCategory._id}`, // set the destination path in the bucket
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
                            newCategory.image = publicUrl
                            await newCategory.save()
                            res.status(200).json(newCategory);
                        });
                        blobStream.on('error', reject);
                    });
                } else {
                    res.status(404).json({ message: 'file not found' });
                }
                // Everything went fine.
            })
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error });
        }
    },
    // Update category by id
    updateCategoryById: async (req, res) => {
        try {
            const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!category) {
                res.status(404).json({ error: 'Category not found.' });
            } else {
                res.status(200).json(category);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating category in database.' });
        }
    },
    // Delete category by id
    deleteCategoryById: async (req, res) => {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);
            const bucket = admin.storage().bucket();
            await bucket.file("categories/"+category._id).delete()
            if (!category) {
                res.status(404).json({ error: 'Category not found.' });
            } else {
                res.status(200).json({message: "category is deleted"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting category from database.' });
        }
    },
    getPostsByCategory: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const category = await Category.findById(categoryId).populate('posts');
            if (!category) {
                return res.status(404).send('Category not found');
            }
            const posts = category.posts;
            return res.status(200).json(posts);
        } catch (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }
    }
}

module.exports = categoryController
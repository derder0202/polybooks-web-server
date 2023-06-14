const {Review, User, Post, Shop} = require("../model/model");
const multer = require("multer");
const admin = require('firebase-admin')
const upload = require('../upload_image').array("images",4)

const reviewController = {
  createReview: async (req, res) => {
    try {
      const { user, post, rating, message } = req.body;
      upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
        } else if (err) {
          // An unknown error occurred when uploading.
        }

        const files = req.files;
        if(files){
          const review = new Review({ user, post, rating, message });
          const bucket = admin.storage().bucket()
          const uploadPromises = files.map((file,index) => {
            const options = {
              destination: `reviews/${review._id}/${index}`,
              metadata: {
                contentType: 'image/jpeg',
              },
            };
            const blob = bucket.file(options.destination);
            const blobStream = blob.createWriteStream(options);
            blobStream.end(file.buffer);
            return new Promise( (resolve, reject) => {
              blobStream.on('finish', async() => {
                await blob.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                resolve(publicUrl);
              });
              blobStream.on('error', reject);
            });
          });
          review.images = await Promise.all(uploadPromises)
          if(user){
            await User.findByIdAndUpdate(user,{$push:{reviews: review._id}})
          }
          if(post){
            const postTemp = await Post.findById(post)
            await post.updateOne({$push:{reviews: review._id}})
            //await Post.findByIdAndUpdate(post,)
            if(post.shopId){
              console.log("shop")
              const shop = await Shop.findById(post.shopId)
              //shop.updateOne({$push:{reviews: review._id}})
              shop.reviews.push(review._id)
              await shop.save()
            }
          }

          const savedReview = await review.save();
          res.status(200).json(savedReview);
        } else {
          const review = new Review(req.body)
          if(user){
            await User.findByIdAndUpdate(user,{$push:{reviews: review._id}})
          }
          if(post){
            const postTemp = await Post.findById(post)
            //console.log(postTemp.shopId.toString())
            await postTemp.updateOne({$push:{reviews: review._id}})
            //await Post.findByIdAndUpdate(post,)
            if(postTemp.shopId){
              const shop = await Shop.findById(postTemp.shopId)
              //shop.updateOne({$push:{reviews: review._id}})
              shop.reviews.push(review._id)
              await shop.save()
            }
          }
          const saveReview = await review.save()
          res.status(200).json(saveReview);
        }
      })
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  update: async (req, res) => {
  try {
    const { rating, message } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, message },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, review: updatedReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
},
  delete: async (req, res) => {
    try {
      const review = await Review.findByIdAndDelete(req.params.id);
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }
      // Update user's reviews field
      const user = await User.findByIdAndUpdate(review.user, { $pull: { reviews: review._id }}, { new: true });
      // Update post's reviews field
      const post = await Post.findByIdAndUpdate(review.post, { $pull: { reviews: review._id }}, { new: true });
      if(post.shopId){
        await Post.findByIdAndUpdate(post.shopId, { $pull: { reviews: review._id }});
      }
      const bucket = admin.storage().bucket();
      await bucket.deleteFiles({
        prefix: "reviews/"+review._id,
      });

      res.status(200).json({ success: true, message: 'Review deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },
  // getReviewsByUser: async (req, res) => {
  //   try {
  //     const user = await User.findById(req.params.userId).populate('reviews');
  //     const reviews = user.reviews;
  //     res.status(200).json(reviews);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ success: false, message: 'Server error' });
  //   }
  // },
  // getReviewsByPost: async (req, res) => {
  //   try {
  //     const post = await Post.findById(req.params.postId).populate('reviews');
  //     const reviews = post.reviews;
  //     res.status(200).json(reviews);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ success: false, message: 'Server error' });
  //   }
  // },
};

module.exports = reviewController;
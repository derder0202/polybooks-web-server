const {Review, User, Post, Shop, Bill, } = require("../model/model");
const multer = require("multer");
const admin = require('firebase-admin')
const upload = require('../upload_image').array("images",4)

const reviewController = {
  getReviews: async (req,res)=>{
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 20;
      const reviews = await Review.find({})
          .skip(startIndex)
          .limit(limit);
      //test
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({error: 'Error getting authors from database.'});
    }
  },
  createReview: async (req, res) => {
    try {
      const review = new Review(req.body)
      if(req.body.bill){
        const billTemp = await Bill.findById(req.body.bill)
          if(billTemp.buyer){
            const user = await User.findById(billTemp.buyer)
            if(user){
              user.buyerReviews.push(review._id)
              await user.save()
            }
          }
          if(billTemp.shopId){
            const shop = await Shop.findById(billTemp.shopId)
            if(shop){
              shop.sellerReviews.push(review._id)
              await shop.save()
            }
          } else {
            if(billTemp.seller){
              const user = await User.findById(billTemp.seller)
              if(user){
                user.sellerReviews.push(review._id)
                await user.save()
              }
            }
          }

      }
      const saveReview = await review.save()
      res.status(200).json(saveReview);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  update: async (req, res) => {
  try {
    const { rating, message, images } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, message, images},
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    const billTemp = await Bill.findById(updatedReview.bill)
    if(updatedReview.status === 0){
      if(billTemp.buyer){
        const user = await User.findById(billTemp.buyer)
        if(user){
          //user.buyerReviews.push(review._id)
          await user.save()
        }
      }
    } else {
      if(billTemp.seller){
        const user = await User.findById(billTemp.seller)
        if(user){
          await user.save()
        }
      }
      if(billTemp.shopId){
        const shop = await Shop.findById(billTemp.shopId)
        if(shop){
          await shop.save()
        }
      }
    }
   // const billTemp = await Bill.findById(updatedReview.bill)
    res.status(200).json({ success: true, review: updatedReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
},
  delete: async (req, res) => {
    try {
      const review = await Review.findByIdAndDelete(req.params.id,{new:true}).populate('bill');
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }
      if(review.bill){
        if(review.bill.buyer){
          await User.findByIdAndUpdate(review.bill.buyer, { $pull: { buyerReviews: review._id }}, { new: true });
        }
        if(review.bill.seller){
          await User.findByIdAndUpdate(review.bill.seller, { $pull: { sellerReview: review._id }}, { new: true });
        }
        if(review.bill.shopId){
            await Shop.findByIdAndUpdate(review.bill.shopId, { $pull: { reviews: review._id }});
        }
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



};

module.exports = reviewController;
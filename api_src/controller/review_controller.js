const {Review, User, Post} = require("../model/model");


const reviewController = {
  create: async (req, res) => {
    try {
      const review = new Review(req.body);
      await review.save();
      // Update user's reviews field
      await User.findByIdAndUpdate(review.user, { $push: { reviews: review._id }}, { new: true });
      // Update post's reviews field
      await Post.findByIdAndUpdate(review.post, { $push: { reviews: review._id }}, { new: true });
      res.status(201).json({ success: true, review });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
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
      res.status(200).json({ success: true, message: 'Review deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },
  getReviewsByUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).populate('reviews');
      const reviews = user.reviews;
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },
  getReviewsByPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId).populate('reviews');
      const reviews = post.reviews;
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },
};

module.exports = reviewController;
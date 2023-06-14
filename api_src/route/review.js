const express = require('express');
const reviewController = require('../controller/review_controller');

const router = express.Router();

// Create a new review
router.post('/', reviewController.createReview);

// Update an existing review
router.put('/:id', reviewController.update);

// Delete an existing review
router.delete('/:id', reviewController.delete);

// // Get all reviews for a user
// router.get('/user/:userId', reviewController.getReviewsByUser);
//
// // Get all reviews for a post
// router.get('/post/:postId', reviewController.getReviewsByPost);

module.exports = router;
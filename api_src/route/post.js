const express = require('express');
const postController = require("../controller/post_controller");
const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');

// GET /posts
router.get('/', postController.getPosts);

// GET /posts/:id
router.get('/:id', postController.getPostById);

// POST /posts
//auth?
router.post('/',  postController.createPost);

// PUT /posts/:id
//auth?
router.put('/:id',  postController.updatePost);

// DELETE /posts/:id
//auth?
router.delete('/:id',  postController.deletePost);

// POST /posts/filter
router.post('/filter', postController.getPostsWithFilter);

module.exports = router;
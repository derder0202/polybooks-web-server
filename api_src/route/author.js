// author router
const express = require('express');
const authorController = require("../controller/author_controller");
const router = express.Router();
// GET /authors
router.get('/', authorController.getAllAuthors);
// GET /authors/:id
router.get('/:id', authorController.getAuthorById);
// POST /authors
router.post('/', authorController.createAuthor);
// PUT /authors/:id
router.put('/:id', authorController.updateAuthorById);
// DELETE /authors/:id
router.delete('/:id', authorController.deleteAuthorById);
module.exports = router;
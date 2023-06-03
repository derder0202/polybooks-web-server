const {Author} = require("../model/model");
const authorController = {
  // Get all authors
    getAllAuthors: async (req, res) => {
        try {
            const startIndex = parseInt(req.query.startIndex) || 0;
            const limit = parseInt(req.query.limit) || 20;
            const authors = await Author.find({})
                .skip(startIndex)
                .limit(limit);
            res.status(200).json(authors);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error getting authors from database.' });
        }
    },

  // Get author by id
  getAuthorById: async (req, res) => {
    try {
      const author = await Author.findById(req.params.id);
      if (!author) {
        res.status(404).json({ error: 'Author not found.' });
      } else {
        res.status(200).json(author);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error getting author from database.' });
    }
  },

  // Create new author
  createAuthor: async (req, res) => {
    try {
      const author = new Author(req.body);
      const newAuthor = await author.save();
      res.status(201).json(newAuthor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating author in database.' });
    }
  },

  // Update author by id
  updateAuthorById: async (req, res) => {
    try {
      const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!author) {
        res.status(404).json({ error: 'Author not found.' });
      } else {
        res.status(200).json(author);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating author in database.' });
    }
  },

  // Delete author by id
  deleteAuthorById: async (req, res) => {
    try {
      const author = await Author.findByIdAndDelete(req.params.id);
      if (!author) {
        res.status(404).json({ error: 'Author not found.' });
      } else {
        res.status(204).json();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting author from database.' });
    }
  }
};

module.exports = authorController
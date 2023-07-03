const {Publisher} = require("../model/model");
const publisherController = {
  getAllPublishers: async (req, res, next) => {
    try {
      const publishers = await Publisher.find()
      res.status(200).json(publishers);
    } catch (error) {
       res.status(500).json("server error");
    }
  },
  getPublisher: async (req, res, next) => {
    try {
      const publisher = await Publisher.findById(req.params.id)
      res.status(200).json(publisher);
    } catch (error) {
       res.status(500).json("server error");
    }
  },
  createPublisher: async (req, res, next) => {
    try {
      const publisher = new Publisher(req.body);
      const result = await publisher.save();
      res.status(200).json(result);
    } catch (error) {
       res.status(500).json("server error");
    }
  },
  updatePublisher: async (req, res, next) => {
    try {
      const publisher = await Publisher.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        posts: req.body.posts
      }, { new: true });
      res.status(200).json(publisher);
    } catch (error) {
       res.status(500).json("server error");
    }
  },
  deletePublisher: async (req, res, next) => {
    try {
      const publisher = await Publisher.findByIdAndDelete(req.params.id);
      res.status(200).json(publisher);
    } catch (error) {
       res.status(500).json("server error");
    }
  }
};
module.exports = publisherController;
const express = require('express');
const publisherController = require("../controller/publisher_controller");
const router = express.Router();

router.get('/', publisherController.getAllPublishers);
router.get('/:id', publisherController.getPublisher);
router.post('/', publisherController.createPublisher);
router.put('/:id', publisherController.updatePublisher);
router.delete('/:id', publisherController.deletePublisher);
module.exports = router;
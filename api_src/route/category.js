const express = require("express");
const categoryController = require("../controller/category_controller");
const router = express.Router();

// Get all categories
router.get("/", categoryController.getCategories);

// Get a category by ID
router.get("/:id", categoryController.getCategoryById);

// Create a new category
router.post("/", categoryController.createCategory);

// Update a category by ID
router.put("/:id", categoryController.updateCategoryById);

// Delete a category by ID
router.delete("/:id", categoryController.deleteCategoryById);

router.get("/:id/posts", categoryController.getPostsByCategory);

module.exports = router;
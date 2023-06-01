import {Category} from "../model/model";

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const startIndex = parseInt(req.query.startIndex) || 0;
            const limit = parseInt(req.query.limit) || 20;
            const categories = await Category.find({})
                .skip(startIndex)
                .limit(limit);
            res.status(200).json(categories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error getting categories from database.' });
        }
    },
    // Get category by id
    getCategoryById: async (req, res) => {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) {
                res.status(404).json({ error: 'Category not found.' });
            } else {
                res.status(200).json(category);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error getting category from database.' });
        }
    },
    // Create new category
    createCategory: async (req, res) => {
        try {
            const category = new Category(req.body);
            const newCategory = await category.save();
            res.status(201).json(newCategory);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating category in database.' });
        }
    },
    // Update category by id
    updateCategoryById: async (req, res) => {
        try {
            const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!category) {
                res.status(404).json({ error: 'Category not found.' });
            } else {
                res.status(200).json(category);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating category in database.' });
        }
    },
    // Delete category by id
    deleteCategoryById: async (req, res) => {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);
            if (!category) {
                res.status(404).json({ error: 'Category not found.' });
            } else {
                res.status(204).json();
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting category from database.' });
        }
    }
}

module.exports = categoryController
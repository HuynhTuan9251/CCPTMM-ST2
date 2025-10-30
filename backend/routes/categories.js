const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const { auth, adminAuth } = require('../middleware/auth');

// GET /api/categories
router.get('/', CategoryController.getAllCategories);

// GET /api/categories/:id
router.get('/:id', CategoryController.getCategoryById);

// POST /api/categories (Admin only)
router.post('/', adminAuth, CategoryController.createCategory);

// PUT /api/categories/:id (Admin only)
router.put('/:id', adminAuth, CategoryController.updateCategory);

// DELETE /api/categories/:id (Admin only)
router.delete('/:id', adminAuth, CategoryController.deleteCategory);

module.exports = router; 
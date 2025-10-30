const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { auth, adminAuth } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

// GET /api/products
router.get('/', ProductController.getAllProducts);

// GET /api/products/:id
router.get('/:id', ProductController.getProductById);

// GET /api/products/category/:categoryId
router.get('/category/:categoryId', ProductController.getProductsByCategory);

// POST /api/products (Admin only)
router.post('/', adminAuth, validateProduct, ProductController.createProduct);

// PUT /api/products/:id (Admin only)
router.put('/:id', adminAuth, validateProduct, ProductController.updateProduct);

// DELETE /api/products/:id (Admin only)
router.delete('/:id', adminAuth, ProductController.deleteProduct);

module.exports = router; 
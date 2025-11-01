const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const { auth } = require('../middleware/auth');

// GET /api/cart/:customerId
router.get('/:customerId', auth, CartController.getCart);

// POST /api/cart
router.post('/', auth, CartController.addToCart);

// PUT /api/cart/:customerId/:productId
router.put('/:customerId/:productId', auth, CartController.updateQuantity);

// DELETE /api/cart/:customerId/:productId
router.delete('/:customerId/:productId', auth, CartController.removeFromCart);

// DELETE /api/cart/:customerId
router.delete('/:customerId', auth, CartController.clearCart);

module.exports = router; 
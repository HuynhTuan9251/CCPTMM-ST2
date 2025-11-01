const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

// GET /api/orders
router.get('/', adminAuth, OrderController.getAllOrders);

// GET /api/orders/:id
router.get('/:id', auth, OrderController.getOrderById);

// GET /api/orders/customer/:customerId
router.get('/customer/:customerId', auth, OrderController.getOrdersByCustomer);

// POST /api/orders
router.post('/', auth, validateOrder, OrderController.createOrder);

// PUT /api/orders/:id/status
router.put('/:id/status', adminAuth, OrderController.updateOrderStatus);

// DELETE /api/orders/:id (Admin only)
router.delete('/:id', adminAuth, OrderController.deleteOrder);

module.exports = router; 
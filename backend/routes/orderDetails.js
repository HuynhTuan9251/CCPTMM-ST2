const express = require('express');
const router = express.Router();
const OrderDetailController = require('../controllers/orderDetailController');
const { auth, adminAuth } = require('../middleware/auth');

// GET /api/order-details (Admin only)
router.get('/', adminAuth, OrderDetailController.getAllOrderDetails);

// GET /api/order-details/:id
router.get('/:id', auth, OrderDetailController.getOrderDetailById);

// GET /api/order-details/order/:orderId
router.get('/order/:orderId', auth, OrderDetailController.getOrderDetailsByOrderId);

// POST /api/order-details
router.post('/', auth, OrderDetailController.createOrderDetail);

// PUT /api/order-details/:id
router.put('/:id', auth, OrderDetailController.updateOrderDetail);

// DELETE /api/order-details/:id (Admin only)
router.delete('/:id', adminAuth, OrderDetailController.deleteOrderDetail);

module.exports = router; 
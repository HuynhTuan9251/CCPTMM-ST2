const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const { auth, adminAuth } = require('../middleware/auth');

// GET /api/payments (Admin only)
router.get('/', adminAuth, PaymentController.getAllPayments);

// GET /api/payments/:id
router.get('/:id', auth, PaymentController.getPaymentById);

// GET /api/payments/order/:orderId
router.get('/order/:orderId', auth, PaymentController.getPaymentByOrderId);

// POST /api/payments
router.post('/', auth, PaymentController.createPayment);

// PUT /api/payments/:orderId/status (Admin only)
router.put('/:orderId/status', adminAuth, PaymentController.updatePaymentStatus);

// DELETE /api/payments/:id (Admin only)
router.delete('/:id', adminAuth, PaymentController.deletePayment);

module.exports = router; 
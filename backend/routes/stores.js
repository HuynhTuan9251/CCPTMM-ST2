const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/storeController');
const { auth, adminAuth } = require('../middleware/auth');

// GET /api/stores
router.get('/', StoreController.getAllStores);

// GET /api/stores/search
router.get('/search', StoreController.searchStores);

// GET /api/stores/:id
router.get('/:id', StoreController.getStoreById);

// POST /api/stores (Admin only)
router.post('/', adminAuth, StoreController.createStore);

// PUT /api/stores/:id (Admin only)
router.put('/:id', adminAuth, StoreController.updateStore);

// DELETE /api/stores/:id (Admin only)
router.delete('/:id', adminAuth, StoreController.deleteStore);

module.exports = router; 
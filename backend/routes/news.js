const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/newsController');
const { auth, adminAuth } = require('../middleware/auth');

// GET /api/news
router.get('/', NewsController.getAllNews);

// GET /api/news/:id
router.get('/:id', NewsController.getNewsById);

// POST /api/news (Admin only)
router.post('/', adminAuth, NewsController.createNews);

// PUT /api/news/:id (Admin only)
router.put('/:id', adminAuth, NewsController.updateNews);

// DELETE /api/news/:id (Admin only)
router.delete('/:id', adminAuth, NewsController.deleteNews);

module.exports = router; 
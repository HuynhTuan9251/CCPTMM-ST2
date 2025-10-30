const express = require('express');
const router = express.Router();
const NewsDetailController = require('../controllers/newsDetailController');
const { auth, adminAuth } = require('../middleware/auth');

// Đặt các route đặc biệt lên trước
// GET /api/news-details/all
router.get('/all', NewsDetailController.getAllNewsDetails);

// GET /api/news-details/detail/:id
router.get('/detail/:id', NewsDetailController.getNewsDetailById);

// GET /api/news-details/:newsId
router.get('/:newsId', NewsDetailController.getNewsDetailsByNewsId);

// POST /api/news-details (Admin only)
router.post('/', adminAuth, NewsDetailController.createNewsDetail);

// PUT /api/news-details/:id (Admin only)
router.put('/:id', adminAuth, NewsDetailController.updateNewsDetail);

// DELETE /api/news-details/:id (Admin only)
router.delete('/:id', adminAuth, NewsDetailController.deleteNewsDetail);

module.exports = router; 
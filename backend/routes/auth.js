const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { validateUser, validateLogin } = require('../middleware/validation');

// POST /api/auth/register
router.post('/register', validateUser, AuthController.register);

// POST /api/auth/login
router.post('/login', validateLogin, AuthController.login);

// GET /api/auth/profile
router.get('/profile', auth, AuthController.getProfile);

// PUT /api/auth/change-password
router.put('/change-password', auth, AuthController.changePassword);

// POST /api/auth/logout
router.post('/logout', AuthController.logout);

// POST /api/auth/google-login
router.post('/google-login', AuthController.googleLogin);

// GET /api/auth/users (lấy danh sách người dùng)
router.get('/users', AuthController.getAllUsers);

// GET /api/auth/users/:id (lấy người dùng theo id)
router.get('/users/:id', AuthController.getUserById);

// PUT /api/auth/users/:id (cập nhật người dùng)
router.put('/users/:id', AuthController.updateUser);

// DELETE /api/auth/users/:id (xóa người dùng)
router.delete('/users/:id', AuthController.deleteUser);

// POST /api/auth/forgot-password (gửi mã xác nhận qua email)
router.post('/forgot-password', AuthController.forgotPassword);

// POST /api/auth/reset-password (đặt lại mật khẩu)
router.post('/reset-password', AuthController.resetPassword);

module.exports = router; 
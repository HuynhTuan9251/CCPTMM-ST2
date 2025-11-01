/* eslint-disable */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const nodemailer = require('nodemailer');
const resetCodes = {};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER || 'nguyendanh9991@gmail.com',
    pass: process.env.EMAIL_PASS || 'zkviarxbkzzmoums',
  },
});

class AuthController {
  static async register(req, res) {
    try {
      const { TenNguoiDung, SoDienThoai, Email, MatKhau, VaiTro } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(Email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được sử dụng'
        });
      }

      // Create new user
      const userId = await User.create({
        TenNguoiDung,
        SoDienThoai,
        Email,
        MatKhau,
        VaiTro: VaiTro || 'KhachHang'
      });

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: { MaNguoiDung: userId }
      });
    } catch (error) {
      logger.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đăng ký'
      });
    }
  }

  static async login(req, res) {
    try {
      const { Email, MatKhau } = req.body;

      // Find user by email
      const user = await User.findByEmail(Email);
      console.log('DEBUG login - user from DB:', user);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không đúng'
        });
      }

      // Verify password
      const isMatch = await User.verifyPassword(MatKhau, user.MatKhau);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không đúng'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.MaNguoiDung, 
          email: user.Email, 
          VaiTro: user.VaiTro 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
      );

      const responseData = {
        MaNguoiDung: user.MaNguoiDung,
        TenNguoiDung: user.TenNguoiDung,
        Email: user.Email,
        SoDienThoai: user.SoDienThoai,
        VaiTro: user.VaiTro,
        token
      };
      console.log('DEBUG login - responseData:', responseData);
      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: responseData
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đăng nhập'
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      console.log('DEBUG getProfile - user from DB:', user);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      const responseData = {
        MaNguoiDung: user.MaNguoiDung,
        TenNguoiDung: user.TenNguoiDung,
        Email: user.Email,
        SoDienThoai: user.SoDienThoai,
        VaiTro: user.VaiTro
      };
      console.log('DEBUG getProfile - responseData:', responseData);
      res.json({
        success: true,
        data: responseData
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin người dùng'
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { MatKhauCu, MatKhauMoi } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      // Verify old password
      const isMatch = await User.verifyPassword(MatKhauCu, user.MatKhau);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Mật khẩu cũ không đúng'
        });
      }

      // Update password
      await User.updatePassword(userId, MatKhauMoi);

      res.json({
        success: true,
        message: 'Đổi mật khẩu thành công'
      });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đổi mật khẩu'
      });
    }
  }

  static async logout(req, res) {
    res.json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  }

  static async googleLogin(req, res) {
    try {
      const { email, name } = req.body;
      if (!email || !name) {
        return res.status(400).json({ success: false, message: 'Thiếu thông tin Google user' });
      }
      let user = await User.findByEmail(email);
      if (!user) {
        // Nếu chưa có user, tạo mới
        const userId = await User.create({ TenNguoiDung: name, Email: email, VaiTro: 'KhachHang' });
        user = await User.findById(userId);
      }
      // Tạo JWT token
      const token = jwt.sign(
        { id: user.MaNguoiDung, email: user.Email, VaiTro: user.VaiTro },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
      );
      res.json({
        success: true,
        message: 'Đăng nhập Google thành công',
        data: {
          MaNguoiDung: user.MaNguoiDung,
          TenNguoiDung: user.TenNguoiDung,
          Email: user.Email,
          SoDienThoai: user.SoDienThoai,
          VaiTro: user.VaiTro,
          token
        }
      });
    } catch (error) {
      logger.error('Google login error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập Google' });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json({ success: true, data: users });
    } catch (err) {
      logger.error('Error fetching users:', err);
      res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách người dùng' });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      }
      res.json({ success: true, data: user });
    } catch (err) {
      logger.error('Error fetching user:', err);
      res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin người dùng' });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { TenNguoiDung, SoDienThoai, Email, MatKhau, VaiTro } = req.body;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      }
      await User.update(id, { TenNguoiDung, SoDienThoai, Email, MatKhau, VaiTro });
      res.json({ success: true, message: 'Cập nhật người dùng thành công' });
    } catch (err) {
      logger.error('Error updating user:', err);
      res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật người dùng' });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      }
      await User.delete(id);
      res.json({ success: true, message: 'Xóa người dùng thành công' });
    } catch (err) {
      logger.error('Error deleting user:', err);
      res.status(500).json({ success: false, message: 'Lỗi server khi xóa người dùng' });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { Email } = req.body;
      if (!Email) {
        return res.status(400).json({ success: false, message: 'Email là bắt buộc' });
      }
      const user = await User.findByEmail(Email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Email không tồn tại' });
      }
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      resetCodes[Email] = { code, expiresAt: Date.now() + 10 * 60 * 1000 };
      const mailOptions = {
        from: process.env.EMAIL_USER || 'nguyendanh9991@gmail.com',
        to: Email,
        subject: 'Mã xác nhận để đặt lại mật khẩu',
        text: `Mã xác nhận của bạn là: ${code}. Mã này có hiệu lực trong 10 phút.`,
      };
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: 'Mã xác nhận đã được gửi đến email của bạn' });
    } catch (err) {
      logger.error('Lỗi khi gửi mã xác nhận:', err);
      res.status(500).json({ success: false, message: 'Lỗi server khi gửi mã xác nhận' });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { Email, Code, MatKhauMoi } = req.body;
      if (!Email || !Code || !MatKhauMoi) {
        return res.status(400).json({ success: false, message: 'Email, mã xác nhận và mật khẩu mới là bắt buộc' });
      }
      const storedCode = resetCodes[Email];
      if (!storedCode || storedCode.expiresAt < Date.now() || storedCode.code !== Code) {
        delete resetCodes[Email];
        return res.status(400).json({ success: false, message: 'Mã xác nhận không đúng hoặc đã hết hạn' });
      }
      delete resetCodes[Email];
      await User.updatePasswordByEmail(Email, MatKhauMoi);
      res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công' });
    } catch (err) {
      logger.error('Lỗi khi đặt lại mật khẩu:', err);
      res.status(500).json({ success: false, message: 'Lỗi server khi đặt lại mật khẩu' });
    }
  }
}

module.exports = AuthController; 
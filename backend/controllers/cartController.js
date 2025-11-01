const Cart = require('../models/Cart');
const { translateText } = require('../utils/translate');
const logger = require('../utils/logger');

class CartController {
  static async getCart(req, res) {
    try {
      const { customerId } = req.params;
      const lang = req.query.lang || 'vi';
      
      const cartItems = await Cart.findByCustomerId(customerId);
      
      const translatedCartItems = await Promise.all(
        cartItems.map(async (item) => ({
          MaKhachHang: item.MaKhachHang,
          MaSanPham: item.MaSanPham,
          SoLuong: item.SoLuong,
          TenSanPham: await translateText(item.TenSanPham, lang),
          Gia: item.Gia,
          HinhAnh: item.HinhAnh,
        }))
      );

      res.json({
        success: true,
        data: translatedCartItems
      });
    } catch (error) {
      logger.error('Get cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy giỏ hàng'
      });
    }
  }

  static async addToCart(req, res) {
    try {
      const cartData = req.body;
      const { MaKhachHang, MaSanPham, SoLuong } = cartData;
      
      if (!MaKhachHang || !MaSanPham || !SoLuong) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin cần thiết'
        });
      }

      await Cart.addToCart(cartData);

      res.status(201).json({
        success: true,
        message: 'Thêm vào giỏ hàng thành công'
      });
    } catch (error) {
      logger.error('Add to cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi thêm vào giỏ hàng'
      });
    }
  }

  static async updateQuantity(req, res) {
    try {
      const { customerId, productId } = req.params;
      const { SoLuong } = req.body;
      
      if (!SoLuong || SoLuong < 1) {
        return res.status(400).json({
          success: false,
          message: 'Số lượng phải lớn hơn 0'
        });
      }

      const updated = await Cart.updateQuantity(customerId, productId, SoLuong);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm trong giỏ hàng'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật số lượng thành công'
      });
    } catch (error) {
      logger.error('Update cart quantity error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật số lượng'
      });
    }
  }

  static async removeFromCart(req, res) {
    try {
      const { customerId, productId } = req.params;
      
      const removed = await Cart.removeFromCart(customerId, productId);
      if (!removed) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm trong giỏ hàng'
        });
      }

      res.json({
        success: true,
        message: 'Xóa sản phẩm khỏi giỏ hàng thành công'
      });
    } catch (error) {
      logger.error('Remove from cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa sản phẩm khỏi giỏ hàng'
      });
    }
  }

  static async clearCart(req, res) {
    try {
      const { customerId } = req.params;
      
      await Cart.clearCart(customerId);

      res.json({
        success: true,
        message: 'Xóa giỏ hàng thành công'
      });
    } catch (error) {
      logger.error('Clear cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa giỏ hàng'
      });
    }
  }
}

module.exports = CartController; 
const Order = require('../models/Order');
const { translateText } = require('../utils/translate');
const logger = require('../utils/logger');

class OrderController {
  static async getAllOrders(req, res) {
    try {
      const lang = req.query.lang || 'vi';
      const orders = await Order.findAll();
      
      const translatedOrders = await Promise.all(
        orders.map(async (order) => ({
          MaDonHang: order.MaDonHang,
          MaKhachHang: order.MaKhachHang,
          TongTien: order.TongTien,
          DiaChi: await translateText(order.DiaChi, lang),
          TrangThai: await translateText(order.TrangThai, lang),
          NgayDatHang: order.NgayDatHang,
        }))
      );

      res.json({
        success: true,
        data: translatedOrders
      });
    } catch (error) {
      logger.error('Get all orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách đơn hàng'
      });
    }
  }

  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const lang = req.query.lang || 'vi';
      
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      const translatedOrder = {
        MaDonHang: order.MaDonHang,
        MaKhachHang: order.MaKhachHang,
        TongTien: order.TongTien,
        DiaChi: await translateText(order.DiaChi, lang),
        TrangThai: await translateText(order.TrangThai, lang),
        NgayDatHang: order.NgayDatHang,
      };

      res.json({
        success: true,
        data: translatedOrder
      });
    } catch (error) {
      logger.error('Get order by id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin đơn hàng'
      });
    }
  }

  static async getOrdersByCustomer(req, res) {
    try {
      const { customerId } = req.params;
      const lang = req.query.lang || 'vi';
      
      const orders = await Order.findByCustomerId(customerId);
      
      const translatedOrders = await Promise.all(
        orders.map(async (order) => ({
          MaDonHang: order.MaDonHang,
          MaKhachHang: order.MaKhachHang,
          TongTien: order.TongTien,
          DiaChi: await translateText(order.DiaChi, lang),
          TrangThai: await translateText(order.TrangThai, lang),
          NgayDatHang: order.NgayDatHang,
        }))
      );

      res.json({
        success: true,
        data: translatedOrders
      });
    } catch (error) {
      logger.error('Get orders by customer error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy đơn hàng của khách hàng'
      });
    }
  }

  static async createOrder(req, res) {
    try {
      const orderData = req.body;
      const orderId = await Order.create(orderData);

      res.status(201).json({
        success: true,
        message: 'Tạo đơn hàng thành công',
        data: { MaDonHang: orderId }
      });
    } catch (error) {
      logger.error('Create order error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo đơn hàng'
      });
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { TrangThai } = req.body;
      
      const updated = await Order.updateStatus(id, TrangThai);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng để cập nhật'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật trạng thái đơn hàng thành công'
      });
    } catch (error) {
      logger.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật trạng thái đơn hàng'
      });
    }
  }

  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await Order.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng để xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa đơn hàng thành công'
      });
    } catch (error) {
      logger.error('Delete order error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa đơn hàng'
      });
    }
  }
}

module.exports = OrderController; 
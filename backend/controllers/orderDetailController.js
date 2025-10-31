const OrderDetail = require('../models/OrderDetail');
const { translateText } = require('../utils/translate');
const logger = require('../utils/logger');

class OrderDetailController {
  static async getAllOrderDetails(req, res) {
    try {
      const orderDetails = await OrderDetail.findAll();

      res.json({
        success: true,
        data: orderDetails
      });
    } catch (error) {
      logger.error('Get all order details error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách chi tiết đơn hàng'
      });
    }
  }

  static async getOrderDetailById(req, res) {
    try {
      const { id } = req.params;
      
      const orderDetail = await OrderDetail.findById(id);
      if (!orderDetail) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chi tiết đơn hàng'
        });
      }

      res.json({
        success: true,
        data: orderDetail
      });
    } catch (error) {
      logger.error('Get order detail by id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin chi tiết đơn hàng'
      });
    }
  }

  static async getOrderDetailsByOrderId(req, res) {
    try {
      const { orderId } = req.params;
      const lang = req.query.lang || 'vi';
      
      const orderDetails = await OrderDetail.findByOrderId(orderId);
      
      if (orderDetails.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chi tiết đơn hàng nào'
        });
      }

      const translatedOrderDetails = await Promise.all(
        orderDetails.map(async (detail) => ({
          ...detail,
          TenSanPham: await translateText(detail.TenSanPham, lang),
        }))
      );

      res.json({
        success: true,
        data: translatedOrderDetails
      });
    } catch (error) {
      logger.error('Get order details by order id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy chi tiết đơn hàng'
      });
    }
  }

  static async createOrderDetail(req, res) {
    try {
      const orderDetailData = req.body;
      const orderDetailId = await OrderDetail.create(orderDetailData);

      res.status(201).json({
        success: true,
        message: 'Tạo chi tiết đơn hàng thành công',
        data: { MaChiTietHoaDon: orderDetailId }
      });
    } catch (error) {
      logger.error('Create order detail error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo chi tiết đơn hàng'
      });
    }
  }

  static async updateOrderDetail(req, res) {
    try {
      const { id } = req.params;
      const orderDetailData = req.body;
      
      const updated = await OrderDetail.update(id, orderDetailData);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chi tiết đơn hàng để cập nhật'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật chi tiết đơn hàng thành công'
      });
    } catch (error) {
      logger.error('Update order detail error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật chi tiết đơn hàng'
      });
    }
  }

  static async deleteOrderDetail(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await OrderDetail.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chi tiết đơn hàng để xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa chi tiết đơn hàng thành công'
      });
    } catch (error) {
      logger.error('Delete order detail error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa chi tiết đơn hàng'
      });
    }
  }
}

module.exports = OrderDetailController; 
const Payment = require('../models/Payment');
const { translateText } = require('../utils/translate');
const logger = require('../utils/logger');    

class PaymentController {
  static async getAllPayments(req, res) {
    try {
      const lang = req.query.lang || 'vi';
      const payments = await Payment.findAll();
      
      const translatedPayments = await Promise.all(
        payments.map(async (payment) => ({
          MaThanhToan: payment.MaThanhToan,
          MaDonHang: payment.MaDonHang,
          MaPhuongThuc: payment.MaPhuongThuc,
          SoTien: payment.SoTien,
          TrangThai: await translateText(payment.TrangThai, lang),
          NgayThanhToan: payment.NgayThanhToan,
        }))
      );

      res.json({
        success: true,
        data: translatedPayments
      });
    } catch (error) {
      logger.error('Get all payments error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách thanh toán'
      });
    }
  }

  static async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const lang = req.query.lang || 'vi';
      
      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thanh toán'
        });
      }

      const translatedPayment = {
        MaThanhToan: payment.MaThanhToan,
        MaDonHang: payment.MaDonHang,
        MaPhuongThuc: payment.MaPhuongThuc,
        SoTien: payment.SoTien,
        TrangThai: await translateText(payment.TrangThai, lang),
        NgayThanhToan: payment.NgayThanhToan,
      };

      res.json({
        success: true,
        data: translatedPayment
      });
    } catch (error) {
      logger.error('Get payment by id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin thanh toán'
      });
    }
  }

  static async getPaymentByOrderId(req, res) {
    try {
      const { orderId } = req.params;
      const lang = req.query.lang || 'vi';
      
      const payment = await Payment.findByOrderId(orderId);
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thanh toán cho đơn hàng này'
        });
      }

      const translatedPayment = {
        MaThanhToan: payment.MaThanhToan,
        MaDonHang: payment.MaDonHang,
        MaPhuongThuc: payment.MaPhuongThuc,
        SoTien: payment.SoTien,
        TrangThai: await translateText(payment.TrangThai, lang),
        NgayThanhToan: payment.NgayThanhToan,
      };

      res.json({
        success: true,
        data: translatedPayment
      });
    } catch (error) {
      logger.error('Get payment by order id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin thanh toán'
      });
    }
  }

  static async createPayment(req, res) {
    try {
      const paymentData = req.body;
      const paymentId = await Payment.create(paymentData);

      res.status(201).json({
        success: true,
        message: 'Tạo thanh toán thành công',
        data: { MaThanhToan: paymentId }
      });
    } catch (error) {
      logger.error('Create payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo thanh toán'
      });
    }
  }

  static async updatePaymentStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { TrangThai } = req.body;
      
      const updated = await Payment.updateStatus(orderId, TrangThai);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thanh toán để cập nhật'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật trạng thái thanh toán thành công'
      });
    } catch (error) {
      logger.error('Update payment status error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật trạng thái thanh toán'
      });
    }
  }

  static async deletePayment(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await Payment.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thanh toán để xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa thanh toán thành công'
      });
    } catch (error) {
      logger.error('Delete payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa thanh toán'
      });
    }
  }
}

module.exports = PaymentController; 
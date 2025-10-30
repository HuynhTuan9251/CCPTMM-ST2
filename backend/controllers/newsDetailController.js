const NewsDetail = require('../models/NewsDetail');
const { translateText } = require('../utils/translate');
const logger = require('../utils/logger');

class NewsDetailController {
  static async getNewsDetailsByNewsId(req, res) {
    try {
      const { newsId } = req.params;
      const lang = req.query.lang || 'vi';
      
      const newsDetails = await NewsDetail.findByNewsId(newsId);
      
      const translatedNewsDetails = await Promise.all(
        newsDetails.map(async (detail) => ({
          id: detail.id,
          tin_tuc_id: detail.tin_tuc_id,
          noi_dung: await translateText(detail.noi_dung, lang),
          danh_sach_san_pham: await translateText(detail.danh_sach_san_pham, lang),
          ma_khuyen_mai: await translateText(detail.ma_khuyen_mai, lang),
          thoi_gian_ap_dung: await translateText(detail.thoi_gian_ap_dung, lang),
          lien_ket: await translateText(detail.lien_ket, lang),
          hinh_anh: detail.hinh_anh,
        }))
      );

      res.json({
        success: true,
        data: translatedNewsDetails
      });
    } catch (error) {
      logger.error('Get news details by news id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy chi tiết tin tức'
      });
    }
  }

  static async getNewsDetailById(req, res) {
    try {
      const { id } = req.params;
      const lang = req.query.lang || 'vi';
      
      const newsDetail = await NewsDetail.findById(id);
      if (!newsDetail) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chi tiết tin tức'
        });
      }

      const translatedNewsDetail = {
        id: newsDetail.id,
        tin_tuc_id: newsDetail.tin_tuc_id,
        noi_dung: await translateText(newsDetail.noi_dung, lang),
        danh_sach_san_pham: await translateText(newsDetail.danh_sach_san_pham, lang),
        ma_khuyen_mai: await translateText(newsDetail.ma_khuyen_mai, lang),
        thoi_gian_ap_dung: await translateText(newsDetail.thoi_gian_ap_dung, lang),
        lien_ket: await translateText(newsDetail.lien_ket, lang),
        hinh_anh: newsDetail.hinh_anh,
      };

      res.json({
        success: true,
        data: translatedNewsDetail
      });
    } catch (error) {
      logger.error('Get news detail by id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin chi tiết tin tức'
      });
    }
  }

  static async getAllNewsDetails(req, res) {
    try {
      const newsDetails = await NewsDetail.findAll();
      res.json({ success: true, data: newsDetails });
    } catch (error) {
      logger.error('Get all news details error:', error);
      console.error('DEBUG getAllNewsDetails error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy tất cả chi tiết tin tức',
        error: error.message,
        stack: error.stack
      });
    }
  }

  static async createNewsDetail(req, res) {
    try {
      const newsDetailData = req.body;
      const { tin_tuc_id, noi_dung } = newsDetailData;
      
      if (!tin_tuc_id || !noi_dung) {
        return res.status(400).json({
          success: false,
          message: 'tin_tuc_id và noi_dung là bắt buộc'
        });
      }

      const newNewsDetail = await NewsDetail.create(newsDetailData);

      res.status(201).json({
        success: true,
        message: 'Tạo chi tiết tin tức thành công',
        data: newNewsDetail
      });
    } catch (error) {
      logger.error('Create news detail error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo chi tiết tin tức'
      });
    }
  }

  static async updateNewsDetail(req, res) {
    try {
      const { id } = req.params;
      const newsDetailData = req.body;
      const { tin_tuc_id, noi_dung } = newsDetailData;
      
      if (!tin_tuc_id || !noi_dung) {
        return res.status(400).json({
          success: false,
          message: 'tin_tuc_id và noi_dung là bắt buộc'
        });
      }
      
      const updatedNewsDetail = await NewsDetail.update(id, newsDetailData);
      if (!updatedNewsDetail) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chi tiết tin tức để cập nhật'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật chi tiết tin tức thành công',
        data: updatedNewsDetail
      });
    } catch (error) {
      logger.error('Update news detail error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật chi tiết tin tức'
      });
    }
  }

  static async deleteNewsDetail(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await NewsDetail.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy chi tiết tin tức để xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa chi tiết tin tức thành công'
      });
    } catch (error) {
      logger.error('Delete news detail error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa chi tiết tin tức'
      });
    }
  }
}

module.exports = NewsDetailController; 
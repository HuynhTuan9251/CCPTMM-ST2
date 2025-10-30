const News = require('../models/News');
const { translateText } = require('../utils/translate');
const logger = require('../utils/logger');

class NewsController {
  static async getAllNews(req, res) {
    try {
      const lang = req.query.lang || 'vi';
      const news = await News.findAll();
      
      const translatedNews = await Promise.all(
        news.map(async (item) => ({
          id: item.id,
          tieu_de: await translateText(item.tieu_de, lang),
          hinh_anh: item.hinh_anh,
          ngay_tao: item.ngay_tao,
        }))
      );

      res.json({
        success: true,
        data: translatedNews
      });
    } catch (error) {
      logger.error('Get all news error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách tin tức'
      });
    }
  }

  static async getNewsById(req, res) {
    try {
      const { id } = req.params;
      const lang = req.query.lang || 'vi';
      
      const news = await News.findById(id);
      if (!news) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy tin tức'
        });
      }

      const translatedNews = {
        id: news.id,
        tieu_de: await translateText(news.tieu_de, lang),
        hinh_anh: news.hinh_anh,
        ngay_tao: news.ngay_tao,
      };

      res.json({
        success: true,
        data: translatedNews
      });
    } catch (error) {
      logger.error('Get news by id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin tin tức'
      });
    }
  }

  static async createNews(req, res) {
    try {
      const newsData = req.body;
      const newNews = await News.create(newsData);

      res.status(201).json({
        success: true,
        message: 'Tạo tin tức thành công',
        data: newNews
      });
    } catch (error) {
      logger.error('Create news error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo tin tức'
      });
    }
  }

  static async updateNews(req, res) {
    try {
      const { id } = req.params;
      const newsData = req.body;
      
      const updatedNews = await News.update(id, newsData);
      if (!updatedNews) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy tin tức để cập nhật'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật tin tức thành công',
        data: updatedNews
      });
    } catch (error) {
      logger.error('Update news error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật tin tức'
      });
    }
  }

  static async deleteNews(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await News.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy tin tức để xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa tin tức thành công'
      });
    } catch (error) {
      logger.error('Delete news error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa tin tức'
      });
    }
  }
}

module.exports = NewsController; 
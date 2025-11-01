const Category = require('../models/Category');
const { translateText } = require('../utils/translate');
const logger = require('../utils/logger');

class CategoryController {
  static async getAllCategories(req, res) {
    try {
      const lang = req.query.lang || 'vi';
      const categories = await Category.findAll();
      
      const translatedCategories = await Promise.all(
        categories.map(async (category) => ({
          MaLoaiSanPham: category.MaLoaiSanPham,
          TenLoaiSanPham: await translateText(category.TenLoaiSanPham, lang),
          MoTa: await translateText(category.MoTa, lang),
        }))
      );

      res.json({
        success: true,
        data: translatedCategories
      });
    } catch (error) {
      logger.error('Get all categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách loại sản phẩm'
      });
    }
  }

  static async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const lang = req.query.lang || 'vi';
      
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy loại sản phẩm'
        });
      }

      const translatedCategory = {
        MaLoaiSanPham: category.MaLoaiSanPham,
        TenLoaiSanPham: await translateText(category.TenLoaiSanPham, lang),
        MoTa: await translateText(category.MoTa, lang),
      };

      res.json({
        success: true,
        data: translatedCategory
      });
    } catch (error) {
      logger.error('Get category by id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin loại sản phẩm'
      });
    }
  }

  static async createCategory(req, res) {
    try {
      const categoryData = req.body;
      const categoryId = await Category.create(categoryData);

      res.status(201).json({
        success: true,
        message: 'Tạo loại sản phẩm thành công',
        data: { MaLoaiSanPham: categoryId }
      });
    } catch (error) {
      logger.error('Create category error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo loại sản phẩm'
      });
    }
  }

  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const categoryData = req.body;
      
      const updated = await Category.update(id, categoryData);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy loại sản phẩm để cập nhật'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật loại sản phẩm thành công'
      });
    } catch (error) {
      logger.error('Update category error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật loại sản phẩm'
      });
    }
  }

  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await Category.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy loại sản phẩm để xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa loại sản phẩm thành công'
      });
    } catch (error) {
      logger.error('Delete category error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa loại sản phẩm'
      });
    }
  }
}

module.exports = CategoryController; 
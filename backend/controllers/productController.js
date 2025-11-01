const Product = require('../models/Product');
const { translateText } = require('../utils/translate');
const logger = require('../utils/logger');

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const lang = req.query.lang || 'vi';
      const products = await Product.findAll();
      
      const translatedProducts = await Promise.all(
        products.map(async (product) => ({
          MaSanPham: product.MaSanPham,
          TenSanPham: await translateText(product.TenSanPham, lang),
          Gia: product.Gia,
          MaLoaiSanPham: product.MaLoaiSanPham,
          MoTa: await translateText(product.MoTa, lang),
          HinhAnh: product.HinhAnh,
        }))
      );

      res.json({
        success: true,
        data: translatedProducts
      });
    } catch (error) {
      logger.error('Get all products error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách sản phẩm'
      });
    }
  }

  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const lang = req.query.lang || 'vi';
      
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm'
        });
      }

      const translatedProduct = {
        MaSanPham: product.MaSanPham,
        TenSanPham: await translateText(product.TenSanPham, lang),
        Gia: product.Gia,
        MaLoaiSanPham: product.MaLoaiSanPham,
        MoTa: await translateText(product.MoTa, lang),
        HinhAnh: product.HinhAnh,
      };

      res.json({
        success: true,
        data: translatedProduct
      });
    } catch (error) {
      logger.error('Get product by id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin sản phẩm'
      });
    }
  }

  static async getProductsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const lang = req.query.lang || 'vi';
      
      const products = await Product.findByCategory(categoryId);
      
      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm nào thuộc loại này'
        });
      }

      const translatedProducts = await Promise.all(
        products.map(async (product) => ({
          MaSanPham: product.MaSanPham,
          TenSanPham: await translateText(product.TenSanPham, lang),
          Gia: product.Gia,
          MaLoaiSanPham: product.MaLoaiSanPham,
          MoTa: await translateText(product.MoTa, lang),
          HinhAnh: product.HinhAnh,
        }))
      );

      res.json({
        success: true,
        data: translatedProducts
      });
    } catch (error) {
      logger.error('Get products by category error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy sản phẩm theo loại'
      });
    }
  }

  static async createProduct(req, res) {
    try {
      const productData = req.body;
      const newProduct = await Product.create(productData);

      res.status(201).json({
        success: true,
        message: 'Tạo sản phẩm thành công',
        data: newProduct
      });
    } catch (error) {
      logger.error('Create product error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo sản phẩm'
      });
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = req.body;
      
      const updated = await Product.update(id, productData);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm để cập nhật'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật sản phẩm thành công'
      });
    } catch (error) {
      logger.error('Update product error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật sản phẩm'
      });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await Product.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm để xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa sản phẩm thành công'
      });
    } catch (error) {
      logger.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa sản phẩm'
      });
    }
  }
}

module.exports = ProductController; 
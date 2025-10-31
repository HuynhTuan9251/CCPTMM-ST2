const sql = require('mssql');
const { getPool } = require('../config/database');

class Cart {
  static async findByCustomerId(customerId) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaKhachHang', sql.Int, customerId)
      .query(`
        SELECT 
          gh.MaKhachHang, 
          gh.MaSanPham, 
          gh.SoLuong, 
          sp.TenSanPham, 
          sp.Gia, 
          sp.HinhAnh
        FROM dbo.GioHang gh
        INNER JOIN dbo.SanPham sp ON gh.MaSanPham = sp.MaSanPham
        WHERE gh.MaKhachHang = @MaKhachHang
      `);
    return result.recordset;
  }

  static async addToCart(cartData) {
    const pool = getPool();
    const { MaKhachHang, MaSanPham, SoLuong } = cartData;
    
    const result = await pool.request()
      .input('MaKhachHang', sql.Int, MaKhachHang)
      .input('MaSanPham', sql.Int, MaSanPham)
      .input('SoLuong', sql.Int, SoLuong)
      .query(`
        IF EXISTS (SELECT 1 FROM dbo.GioHang WHERE MaKhachHang = @MaKhachHang AND MaSanPham = @MaSanPham)
          UPDATE dbo.GioHang
          SET SoLuong = SoLuong + @SoLuong
          WHERE MaKhachHang = @MaKhachHang AND MaSanPham = @MaSanPham
        ELSE
          INSERT INTO dbo.GioHang (MaKhachHang, MaSanPham, SoLuong)
          VALUES (@MaKhachHang, @MaSanPham, @SoLuong)
      `);
    
    return result.rowsAffected[0] > 0;
  }

  static async updateQuantity(customerId, productId, quantity) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaKhachHang', sql.Int, customerId)
      .input('MaSanPham', sql.Int, productId)
      .input('SoLuong', sql.Int, quantity)
      .query(`
        UPDATE dbo.GioHang
        SET SoLuong = @SoLuong
        WHERE MaKhachHang = @MaKhachHang AND MaSanPham = @MaSanPham
      `);
    
    return result.rowsAffected[0] > 0;
  }

  static async removeFromCart(customerId, productId) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaKhachHang', sql.Int, customerId)
      .input('MaSanPham', sql.Int, productId)
      .query(`
        DELETE FROM dbo.GioHang 
        WHERE MaKhachHang = @MaKhachHang AND MaSanPham = @MaSanPham
      `);
    
    return result.rowsAffected[0] > 0;
  }

  static async clearCart(customerId) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaKhachHang', sql.Int, customerId)
      .query('DELETE FROM dbo.GioHang WHERE MaKhachHang = @MaKhachHang');
    
    return result.rowsAffected[0] > 0;
  }
}

module.exports = Cart; 
const sql = require('mssql');
const { getPool } = require('../config/database');

class OrderDetail {
  static async findAll() {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT * FROM dbo.ChiTietHoaDon');
    return result.recordset;
  }

  static async findById(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaChiTietHoaDon', sql.Int, id)
      .query('SELECT * FROM dbo.ChiTietHoaDon WHERE MaChiTietHoaDon = @MaChiTietHoaDon');
    return result.recordset[0];
  }

  static async findByOrderId(orderId) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaDonHang', sql.Int, orderId)
      .query(`
        SELECT 
          cthd.MaChiTietHoaDon,
          cthd.MaDonHang,
          cthd.MaSanPham,
          cthd.SoLuong,
          cthd.DonGia,
          cthd.ThanhTien,
          sp.TenSanPham,
          sp.HinhAnh
        FROM dbo.ChiTietHoaDon cthd
        INNER JOIN dbo.SanPham sp ON cthd.MaSanPham = sp.MaSanPham
        WHERE cthd.MaDonHang = @MaDonHang
      `);
    return result.recordset;
  }

  static async create(orderDetailData) {
    const pool = getPool();
    const { MaDonHang, MaSanPham, SoLuong, DonGia } = orderDetailData;
    
    const result = await pool.request()
      .input('MaDonHang', sql.Int, MaDonHang)
      .input('MaSanPham', sql.Int, MaSanPham)
      .input('SoLuong', sql.Int, SoLuong)
      .input('DonGia', sql.Decimal(10, 2), DonGia)
      .query(`
        INSERT INTO dbo.ChiTietHoaDon (MaDonHang, MaSanPham, SoLuong, DonGia)
        OUTPUT INSERTED.MaChiTietHoaDon
        VALUES (@MaDonHang, @MaSanPham, @SoLuong, @DonGia)
      `);
    
    return result.recordset[0].MaChiTietHoaDon;
  }

  static async update(id, orderDetailData) {
    const pool = getPool();
    const { SoLuong, DonGia } = orderDetailData;
    
    const result = await pool.request()
      .input('MaChiTietHoaDon', sql.Int, id)
      .input('SoLuong', sql.Int, SoLuong)
      .input('DonGia', sql.Decimal(10, 2), DonGia)
      .query(`
        UPDATE dbo.ChiTietHoaDon
        SET SoLuong = @SoLuong, DonGia = @DonGia
        WHERE MaChiTietHoaDon = @MaChiTietHoaDon
      `);
    
    return result.rowsAffected[0] > 0;
  }

  static async delete(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaChiTietHoaDon', sql.Int, id)
      .query('DELETE FROM dbo.ChiTietHoaDon WHERE MaChiTietHoaDon = @MaChiTietHoaDon');
    return result.rowsAffected[0] > 0;
  }

  static async deleteByOrderId(orderId) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaDonHang', sql.Int, orderId)
      .query('DELETE FROM dbo.ChiTietHoaDon WHERE MaDonHang = @MaDonHang');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = OrderDetail; 
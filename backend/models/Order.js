const sql = require('mssql');
const { getPool } = require('../config/database');

class Order {
  static async findAll() {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT * FROM dbo.DonHang');
    return result.recordset;
  }

  static async findById(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaDonHang', sql.Int, id)
      .query('SELECT * FROM dbo.DonHang WHERE MaDonHang = @MaDonHang');
    return result.recordset[0];
  }

  static async findByCustomerId(customerId) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaKhachHang', sql.Int, customerId)
      .query('SELECT * FROM dbo.DonHang WHERE MaKhachHang = @MaKhachHang');
    return result.recordset;
  }

  static async create(orderData) {
    const pool = getPool();
    const { MaKhachHang, TongTien, DiaChi, TrangThai = 'Chưa thanh toán' } = orderData;
    
    const result = await pool.request()
      .input('MaKhachHang', sql.Int, MaKhachHang)
      .input('TongTien', sql.Decimal(10, 2), TongTien)
      .input('DiaChi', sql.NVarChar, DiaChi)
      .input('TrangThai', sql.NVarChar, TrangThai)
      .query(`
        INSERT INTO dbo.DonHang (MaKhachHang, TongTien, DiaChi, TrangThai)
        OUTPUT INSERTED.MaDonHang
        VALUES (@MaKhachHang, @TongTien, @DiaChi, @TrangThai)
      `);
    
    return result.recordset[0].MaDonHang;
  }

  static async updateStatus(id, status) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaDonHang', sql.Int, id)
      .input('TrangThai', sql.NVarChar, status)
      .query(`
        UPDATE dbo.DonHang
        SET TrangThai = @TrangThai
        WHERE MaDonHang = @MaDonHang
      `);
    
    return result.rowsAffected[0] > 0;
  }

  static async delete(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaDonHang', sql.Int, id)
      .query('DELETE FROM dbo.DonHang WHERE MaDonHang = @MaDonHang');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = Order; 
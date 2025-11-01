const sql = require('mssql');
const { getPool } = require('../config/database');

class Payment {
  static async findAll() {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT * FROM dbo.ThanhToan');
    return result.recordset;
  }

  static async findById(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaThanhToan', sql.Int, id)
      .query('SELECT * FROM dbo.ThanhToan WHERE MaThanhToan = @MaThanhToan');
    return result.recordset[0];
  }

  static async findByOrderId(orderId) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaDonHang', sql.Int, orderId)
      .query('SELECT * FROM dbo.ThanhToan WHERE MaDonHang = @MaDonHang');
    return result.recordset[0];
  }

  static async create(paymentData) {
    const pool = getPool();
    const { MaDonHang, MaPhuongThuc, SoTien, TrangThai = 'Chưa thanh toán' } = paymentData;
    
    const result = await pool.request()
      .input('MaDonHang', sql.Int, MaDonHang)
      .input('MaPhuongThuc', sql.Int, MaPhuongThuc)
      .input('SoTien', sql.Decimal(10, 2), SoTien)
      .input('TrangThai', sql.VarChar, TrangThai)
      .query(`
        INSERT INTO dbo.ThanhToan (MaDonHang, MaPhuongThuc, SoTien, TrangThai)
        OUTPUT INSERTED.MaThanhToan
        VALUES (@MaDonHang, @MaPhuongThuc, @SoTien, @TrangThai)
      `);
    
    return result.recordset[0].MaThanhToan;
  }

  static async updateStatus(orderId, status) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaDonHang', sql.Int, orderId)
      .input('TrangThai', sql.VarChar, status)
      .query(`
        UPDATE dbo.ThanhToan
        SET TrangThai = @TrangThai
        WHERE MaDonHang = @MaDonHang
      `);
    
    return result.rowsAffected[0] > 0;
  }

  static async delete(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaThanhToan', sql.Int, id)
      .query('DELETE FROM dbo.ThanhToan WHERE MaThanhToan = @MaThanhToan');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = Payment; 
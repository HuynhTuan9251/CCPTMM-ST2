const sql = require('mssql');
const { getPool } = require('../config/database');

class Category {
  static async findAll() {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT * FROM dbo.LoaiSanPham');
    return result.recordset;
  }

  static async findById(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaLoaiSanPham', sql.Int, id)
      .query('SELECT * FROM dbo.LoaiSanPham WHERE MaLoaiSanPham = @MaLoaiSanPham');
    return result.recordset[0];
  }

  static async create(categoryData) {
    const pool = getPool();
    const { TenLoaiSanPham, MoTa } = categoryData;
    
    const result = await pool.request()
      .input('TenLoaiSanPham', sql.VarChar, TenLoaiSanPham)
      .input('MoTa', sql.VarChar, MoTa)
      .query(`
        INSERT INTO dbo.LoaiSanPham (TenLoaiSanPham, MoTa)
        OUTPUT INSERTED.MaLoaiSanPham
        VALUES (@TenLoaiSanPham, @MoTa)
      `);
    
    return result.recordset[0].MaLoaiSanPham;
  }

  static async update(id, categoryData) {
    const pool = getPool();
    const { TenLoaiSanPham, MoTa } = categoryData;
    
    const result = await pool.request()
      .input('MaLoaiSanPham', sql.Int, id)
      .input('TenLoaiSanPham', sql.VarChar, TenLoaiSanPham)
      .input('MoTa', sql.VarChar, MoTa)
      .query(`
        UPDATE dbo.LoaiSanPham
        SET TenLoaiSanPham = @TenLoaiSanPham, MoTa = @MoTa
        WHERE MaLoaiSanPham = @MaLoaiSanPham
      `);
    
    return result.rowsAffected[0] > 0;
  }

  static async delete(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaLoaiSanPham', sql.Int, id)
      .query('DELETE FROM dbo.LoaiSanPham WHERE MaLoaiSanPham = @MaLoaiSanPham');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = Category; 
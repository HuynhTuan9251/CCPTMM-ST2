const sql = require('mssql');
const { getPool } = require('../config/database');

class Product {
  static async findAll() {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT * FROM dbo.SanPham');
    return result.recordset;
  }

  static async findById(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaSanPham', sql.Int, id)
      .query('SELECT * FROM dbo.SanPham WHERE MaSanPham = @MaSanPham');
    return result.recordset[0];
  }

  static async findByCategory(categoryId) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaLoaiSanPham', sql.Int, categoryId)
      .query('SELECT * FROM dbo.SanPham WHERE MaLoaiSanPham = @MaLoaiSanPham');
    return result.recordset;
  }

  static async create(productData) {
    const pool = getPool();
    const { TenSanPham, Gia, MaLoaiSanPham, MoTa, HinhAnh } = productData;
    
    const result = await pool.request()
      .input('TenSanPham', sql.NVarChar, TenSanPham)
      .input('Gia', sql.Int, Gia)
      .input('MaLoaiSanPham', sql.Int, MaLoaiSanPham)
      .input('MoTa', sql.NVarChar, MoTa)
      .input('HinhAnh', sql.NVarChar, HinhAnh)
      .query(`
        INSERT INTO dbo.SanPham (TenSanPham, Gia, MaLoaiSanPham, MoTa, HinhAnh)
        OUTPUT INSERTED.*
        VALUES (@TenSanPham, @Gia, @MaLoaiSanPham, @MoTa, @HinhAnh)
      `);
    
    return result.recordset[0];
  }

  static async update(id, productData) {
    const pool = getPool();
    const { TenSanPham, Gia, MaLoaiSanPham, MoTa, HinhAnh } = productData;
    
    const result = await pool.request()
      .input('MaSanPham', sql.Int, id)
      .input('TenSanPham', sql.NVarChar, TenSanPham)
      .input('Gia', sql.Int, Gia)
      .input('MaLoaiSanPham', sql.Int, MaLoaiSanPham)
      .input('MoTa', sql.NVarChar, MoTa)
      .input('HinhAnh', sql.NVarChar, HinhAnh)
      .query(`
        UPDATE dbo.SanPham
        SET TenSanPham = @TenSanPham, Gia = @Gia, MaLoaiSanPham = @MaLoaiSanPham, 
            MoTa = @MoTa, HinhAnh = @HinhAnh
        WHERE MaSanPham = @MaSanPham
      `);
    
    return result.rowsAffected[0] > 0;
  }

  static async delete(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaSanPham', sql.Int, id)
      .query('DELETE FROM dbo.SanPham WHERE MaSanPham = @MaSanPham');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = Product; 
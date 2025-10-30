const sql = require('mssql');
const bcrypt = require('bcryptjs');
const { getPool } = require('../config/database');
const logger = require('../utils/logger');

class User {
  static async findAll() {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT MaNguoiDung, TenNguoiDung, Email, SoDienThoai, VaiTro FROM dbo.NguoiDung');
    return result.recordset;
  }

  static async findById(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaNguoiDung', sql.Int, id)
      .query('SELECT * FROM dbo.NguoiDung WHERE MaNguoiDung = @MaNguoiDung');
    return result.recordset[0];
  }

  static async findByEmail(email) {
    const pool = getPool();
    const result = await pool.request()
      .input('Email', sql.VarChar, email)
      .query('SELECT * FROM dbo.NguoiDung WHERE Email = @Email');
    return result.recordset[0];
  }

  static async create(userData) {
    const pool = getPool();
    const { TenNguoiDung, SoDienThoai, Email, MatKhau, VaiTro = 'KhachHang' } = userData;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(MatKhau, salt);

    const result = await pool.request()
      .input('TenNguoiDung', sql.VarChar, TenNguoiDung)
      .input('SoDienThoai', sql.VarChar, SoDienThoai)
      .input('Email', sql.VarChar, Email)
      .input('MatKhau', sql.VarChar, hashedPassword)
      .input('VaiTro', sql.VarChar, VaiTro)
      .query(`
        INSERT INTO dbo.NguoiDung (TenNguoiDung, SoDienThoai, Email, MatKhau, VaiTro)
        OUTPUT INSERTED.MaNguoiDung
        VALUES (@TenNguoiDung, @SoDienThoai, @Email, @MatKhau, @VaiTro)
      `);
    
    return result.recordset[0].MaNguoiDung;
  }

  static async update(id, userData) {
    const pool = getPool();
    const { TenNguoiDung, SoDienThoai, Email, MatKhau, VaiTro } = userData;
    
    let updateQuery = `
      UPDATE dbo.NguoiDung
      SET TenNguoiDung = @TenNguoiDung,
          SoDienThoai = @SoDienThoai,
          Email = @Email,
          VaiTro = @VaiTro
      WHERE MaNguoiDung = @MaNguoiDung
    `;
    
    const request = pool.request()
      .input('MaNguoiDung', sql.Int, id)
      .input('TenNguoiDung', sql.VarChar, TenNguoiDung)
      .input('SoDienThoai', sql.VarChar, SoDienThoai)
      .input('Email', sql.VarChar, Email)
      .input('VaiTro', sql.VarChar, VaiTro);

    if (MatKhau) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(MatKhau, salt);
      request.input('MatKhau', sql.VarChar, hashedPassword);
      updateQuery = updateQuery.replace('VaiTro = @VaiTro', 'MatKhau = @MatKhau, VaiTro = @VaiTro');
    }

    const result = await request.query(updateQuery);
    return result.rowsAffected[0] > 0;
  }

  static async delete(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('MaNguoiDung', sql.Int, id)
      .query('DELETE FROM dbo.NguoiDung WHERE MaNguoiDung = @MaNguoiDung');
    return result.rowsAffected[0] > 0;
  }

  static async updatePassword(id, newPassword) {
    const pool = getPool();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const result = await pool.request()
      .input('MaNguoiDung', sql.Int, id)
      .input('MatKhau', sql.VarChar, hashedPassword)
      .query('UPDATE dbo.NguoiDung SET MatKhau = @MatKhau WHERE MaNguoiDung = @MaNguoiDung');
    
    return result.rowsAffected[0] > 0;
  }

  static async updatePasswordByEmail(email, newPassword) {
    const pool = getPool();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const result = await pool.request()
      .input('Email', sql.VarChar, email)
      .input('MatKhau', sql.VarChar, hashedPassword)
      .query('UPDATE dbo.NguoiDung SET MatKhau = @MatKhau WHERE Email = @Email');
    return result.rowsAffected[0] > 0;
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User; 
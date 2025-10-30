const sql = require('mssql');
const { getPool } = require('../config/database');

class News {
  static async findAll() {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT * FROM TinTuc');
    return result.recordset;
  }

  static async findById(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM TinTuc WHERE id = @id');
    return result.recordset[0];
  }

  static async create(newsData) {
    const pool = getPool();
    const { tieu_de, hinh_anh } = newsData;
    
    const result = await pool.request()
      .input('tieu_de', sql.NVarChar, tieu_de)
      .input('hinh_anh', sql.NVarChar, hinh_anh)
      .query(`
        INSERT INTO TinTuc (tieu_de, hinh_anh) 
        OUTPUT INSERTED.* 
        VALUES (@tieu_de, @hinh_anh)
      `);
    
    return result.recordset[0];
  }

  static async update(id, newsData) {
    const pool = getPool();
    const { tieu_de, hinh_anh } = newsData;
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('tieu_de', sql.NVarChar, tieu_de)
      .input('hinh_anh', sql.NVarChar, hinh_anh)
      .query(`
        UPDATE TinTuc 
        SET tieu_de = @tieu_de, hinh_anh = @hinh_anh 
        OUTPUT INSERTED.* 
        WHERE id = @id
      `);
    
    return result.recordset[0];
  }

  static async delete(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM TinTuc WHERE id = @id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = News; 
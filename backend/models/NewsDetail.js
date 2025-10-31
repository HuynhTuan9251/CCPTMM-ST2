const sql = require('mssql');
const { getPool } = require('../config/database');

class NewsDetail {
  static async findByNewsId(newsId) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, newsId)
      .query('SELECT * FROM ChiTietTinTuc WHERE tin_tuc_id = @id');
    return result.recordset;
  }

  static async findById(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ChiTietTinTuc WHERE id = @id');
    return result.recordset[0];
  }

  static async findAll() {
    const pool = getPool();
    const result = await pool.request().query('SELECT * FROM ChiTietTinTuc');
    return result.recordset;
  }

  static async create(newsDetailData) {
    const pool = getPool();
    const { 
      tin_tuc_id, 
      noi_dung, 
      danh_sach_san_pham, 
      ma_khuyen_mai, 
      thoi_gian_ap_dung, 
      lien_ket, 
      hinh_anh 
    } = newsDetailData;
    
    const result = await pool.request()
      .input('tin_tuc_id', sql.Int, tin_tuc_id)
      .input('noi_dung', sql.NVarChar(sql.MAX), noi_dung)
      .input('danh_sach_san_pham', sql.NVarChar(sql.MAX), danh_sach_san_pham || null)
      .input('ma_khuyen_mai', sql.NVarChar(50), ma_khuyen_mai || null)
      .input('thoi_gian_ap_dung', sql.NVarChar(255), thoi_gian_ap_dung || null)
      .input('lien_ket', sql.NVarChar(500), lien_ket || null)
      .input('hinh_anh', sql.NVarChar(500), hinh_anh || null)
      .query(`
        INSERT INTO ChiTietTinTuc (tin_tuc_id, noi_dung, danh_sach_san_pham, ma_khuyen_mai, thoi_gian_ap_dung, lien_ket, hinh_anh) 
        OUTPUT INSERTED.* 
        VALUES (@tin_tuc_id, @noi_dung, @danh_sach_san_pham, @ma_khuyen_mai, @thoi_gian_ap_dung, @lien_ket, @hinh_anh)
      `);
    
    return result.recordset[0];
  }

  static async update(id, newsDetailData) {
    const pool = getPool();
    const { 
      tin_tuc_id, 
      noi_dung, 
      danh_sach_san_pham, 
      ma_khuyen_mai, 
      thoi_gian_ap_dung, 
      lien_ket, 
      hinh_anh 
    } = newsDetailData;
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('tin_tuc_id', sql.Int, tin_tuc_id)
      .input('noi_dung', sql.NVarChar(sql.MAX), noi_dung)
      .input('danh_sach_san_pham', sql.NVarChar(sql.MAX), danh_sach_san_pham || null)
      .input('ma_khuyen_mai', sql.NVarChar(50), ma_khuyen_mai || null)
      .input('thoi_gian_ap_dung', sql.NVarChar(255), thoi_gian_ap_dung || null)
      .input('lien_ket', sql.NVarChar(500), lien_ket || null)
      .input('hinh_anh', sql.NVarChar(500), hinh_anh || null)
      .query(`
        UPDATE ChiTietTinTuc 
        SET tin_tuc_id = @tin_tuc_id, noi_dung = @noi_dung, danh_sach_san_pham = @danh_sach_san_pham, 
            ma_khuyen_mai = @ma_khuyen_mai, thoi_gian_ap_dung = @thoi_gian_ap_dung, lien_ket = @lien_ket, hinh_anh = @hinh_anh 
        OUTPUT INSERTED.* 
        WHERE id = @id
      `);
    
    return result.recordset[0];
  }

  static async delete(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM ChiTietTinTuc WHERE id = @id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = NewsDetail; 
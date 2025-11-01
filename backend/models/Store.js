const sql = require('mssql');
const { getPool } = require('../config/database');

class Store {
  static async findAll() {
    const pool = getPool();
    const result = await pool.request()
      .query(`
        SELECT StoreID, StoreName, Address, Latitude, Longitude, ImageURL 
        FROM Stores
      `);
    return result.recordset;
  }

  static async findById(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('StoreID', sql.Int, id)
      .query('SELECT * FROM Stores WHERE StoreID = @StoreID');
    return result.recordset[0];
  }

  static async searchByAddress(address) {
    const pool = getPool();
    const result = await pool.request()
      .input('address', sql.NVarChar, `%${address}%`)
      .query(`
        SELECT StoreID, StoreName, Address, Latitude, Longitude, ImageURL 
        FROM Stores 
        WHERE Address LIKE @address
      `);
    return result.recordset;
  }

  static async create(storeData) {
    const pool = getPool();
    const { storeName, address, latitude, longitude, imageUrl } = storeData;
    
    const result = await pool.request()
      .input('storeName', sql.NVarChar, storeName)
      .input('address', sql.NVarChar, address)
      .input('latitude', sql.Float, latitude)
      .input('longitude', sql.Float, longitude)
      .input('imageUrl', sql.NVarChar, imageUrl || null)
      .query(`
        INSERT INTO Stores (StoreName, Address, Latitude, Longitude, ImageURL) 
        OUTPUT INSERTED.* 
        VALUES (@storeName, @address, @latitude, @longitude, @imageUrl)
      `);
    
    return result.recordset[0];
  }

  static async update(id, storeData) {
    const pool = getPool();
    const { storeName, address, latitude, longitude, imageUrl } = storeData;
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('storeName', sql.NVarChar, storeName)
      .input('address', sql.NVarChar, address)
      .input('latitude', sql.Float, latitude)
      .input('longitude', sql.Float, longitude)
      .input('imageUrl', sql.NVarChar, imageUrl || null)
      .query(`
        UPDATE Stores 
        SET StoreName = @storeName, Address = @address, Latitude = @latitude, Longitude = @longitude, ImageURL = @imageUrl 
        OUTPUT INSERTED.* 
        WHERE StoreID = @id
      `);
    
    return result.recordset[0];
  }

  static async delete(id) {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Stores WHERE StoreID = @id');
    return result.rowsAffected[0] > 0;
  }
}

module.exports = Store; 
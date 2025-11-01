const Store = require('../models/Store');
const { translateText } = require('../utils/translate');
const logger = require('../utils/logger');

class StoreController {
  static async getAllStores(req, res) {
    try {
      const lang = req.query.lang || 'vi';
      const stores = await Store.findAll();
      
      const translatedStores = await Promise.all(
        stores.map(async (store) => ({
          StoreID: store.StoreID,
          StoreName: await translateText(store.StoreName, lang),
          Address: await translateText(store.Address, lang),
          Latitude: store.Latitude,
          Longitude: store.Longitude,
          ImageURL: store.ImageURL,
        }))
      );

      res.json({
        success: true,
        data: translatedStores
      });
    } catch (error) {
      logger.error('Get all stores error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách cửa hàng'
      });
    }
  }

  static async getStoreById(req, res) {
    try {
      const { id } = req.params;
      const lang = req.query.lang || 'vi';
      
      const store = await Store.findById(id);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy cửa hàng'
        });
      }

      const translatedStore = {
        StoreID: store.StoreID,
        StoreName: await translateText(store.StoreName, lang),
        Address: await translateText(store.Address, lang),
        Latitude: store.Latitude,
        Longitude: store.Longitude,
        ImageURL: store.ImageURL,
      };

      res.json({
        success: true,
        data: translatedStore
      });
    } catch (error) {
      logger.error('Get store by id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy thông tin cửa hàng'
      });
    }
  }

  static async searchStores(req, res) {
    try {
      const { address } = req.query;
      const lang = req.query.lang || 'vi';
      
      if (!address) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp địa chỉ'
        });
      }

      const stores = await Store.searchByAddress(address);
      
      const translatedStores = await Promise.all(
        stores.map(async (store) => ({
          StoreID: store.StoreID,
          StoreName: await translateText(store.StoreName, lang),
          Address: await translateText(store.Address, lang),
          Latitude: store.Latitude,
          Longitude: store.Longitude,
          ImageURL: store.ImageURL,
        }))
      );

      res.json({
        success: true,
        data: translatedStores
      });
    } catch (error) {
      logger.error('Search stores error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tìm kiếm cửa hàng'
      });
    }
  }

  static async createStore(req, res) {
    try {
      const storeData = req.body;
      const { storeName, address, latitude, longitude, imageUrl } = storeData;
      
      if (!storeName || !address || latitude == null || longitude == null) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp đầy đủ thông tin'
        });
      }

      const newStore = await Store.create(storeData);

      res.status(201).json({
        success: true,
        message: 'Tạo cửa hàng thành công',
        data: newStore
      });
    } catch (error) {
      logger.error('Create store error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi tạo cửa hàng'
      });
    }
  }

  static async updateStore(req, res) {
    try {
      const { id } = req.params;
      const storeData = req.body;
      const { storeName, address, latitude, longitude, imageUrl } = storeData;
      
      if (!storeName || !address || latitude == null || longitude == null) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp đầy đủ thông tin'
        });
      }
      
      const updatedStore = await Store.update(id, storeData);
      if (!updatedStore) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy cửa hàng để cập nhật'
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật cửa hàng thành công',
        data: updatedStore
      });
    } catch (error) {
      logger.error('Update store error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật cửa hàng'
      });
    }
  }

  static async deleteStore(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await Store.delete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy cửa hàng để xóa'
        });
      }

      res.json({
        success: true,
        message: 'Xóa cửa hàng thành công'
      });
    } catch (error) {
      logger.error('Delete store error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi xóa cửa hàng'
      });
    }
  }
}

module.exports = StoreController; 
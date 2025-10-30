import React, { useState } from "react";
import { FaStore, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import * as bootstrap from 'bootstrap';

type Store = {
  StoreID: string;
  StoreName: string;
  Address: string;
  Latitude: number;
  Longitude: number;
  ImageURL: string;
};

const StoreTable = ({ stores, setStores, fetchStores }) => {
  const { t } = useTranslation();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [newStore, setNewStore] = useState({
    storeName: "",
    address: "",
    latitude: "",
    longitude: "",
    imageUrl: "",
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const handleAddStore = async () => {
    try {
      const storeToAdd = {
        ...newStore,
        latitude: Number(newStore.latitude),
        longitude: Number(newStore.longitude),
      };
      const res = await axios.post("http://localhost:3000/api/stores", storeToAdd,authHeader);
      await fetchStores();
      setNewStore({ storeName: "", address: "", latitude: "", longitude: "", imageUrl: "" });
      setMessage(t('addStoreSuccess'));
      const addModal = bootstrap.Modal.getInstance(document.getElementById("addStoreModal"));
      addModal.hide();
    } catch (error) {
      setMessage(t('addStoreError') + error.message);
    }
  };

  const handleUpdateStore = async () => {
    try {
      if (!selectedStore) {
        throw new Error(t('storeNotFound'));
      }
      const storeToUpdate = {
        storeName: selectedStore.StoreName,
        address: selectedStore.Address,
        latitude: Number(selectedStore.Latitude),
        longitude: Number(selectedStore.Longitude),
        imageUrl: selectedStore.ImageURL || null,
      };

      if (!storeToUpdate.storeName || !storeToUpdate.address || storeToUpdate.latitude == null || storeToUpdate.longitude == null) {
        throw new Error(t('requiredFieldsError'));
      }

      const res = await axios.put(`http://localhost:3000/api/stores/${selectedStore.StoreID}`, storeToUpdate,authHeader);
      await fetchStores();
      setSelectedStore(null);
      setMessage(t('updateStoreSuccess'));
      const editModal = document.getElementById("editStoreModal");
      editModal?.classList.remove("show");
      document.body.classList.remove("modal-open");
      document.querySelector(".modal-backdrop")?.remove();
    } catch (error) {
      setMessage(t('updateStoreError') + (error.message || ""));
    }
  };

  const handleDeleteStore = async (StoreID) => {
    try {
      await axios.delete(`http://localhost:3000/api/stores/${StoreID}`,authHeader);
      await fetchStores();
      setMessage(t('deleteStoreSuccess'));
    } catch (error) {
      setMessage(t('deleteStoreError') + error.message);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaStore className="me-2" /> {t('manageStores')}
        </h5>
        <button className="btn btn-light btn-sm" data-bs-toggle="modal" data-bs-target="#addStoreModal">
          <FaPlus /> {t('add')}
        </button>
      </div>
      <div className="card-body">
        {message && <div className="alert alert-info">{message}</div>}
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>{t('storeId')}</th>
                <th>{t('storeName')}</th>
                <th>{t('address')}</th>
                <th>{t('longitude')}</th>
                <th>{t('latitude')}</th>
                <th>{t('image')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.StoreID}>
                  <td>{s.StoreID}</td>
                  <td>{s.StoreName}</td>
                  <td>{s.Address}</td>
                  <td>{s.Longitude}</td>
                  <td>{s.Latitude}</td>
                  <td>
                    {s.ImageURL ? (
                      <img src={s.ImageURL} alt={s.StoreName} width="50" height="50" />
                    ) : (
                      t('noImage')
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#editStoreModal"
                      onClick={() => setSelectedStore(s)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteStore(s.StoreID)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Add Store */}
        <div className="modal fade" id="addStoreModal" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('addStore')}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder={t('storeName')}
                  value={newStore.storeName}
                  onChange={(e) => setNewStore({ ...newStore, storeName: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder={t('address')}
                  value={newStore.address}
                  onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder={t('latitude')}
                  type="number"
                  value={newStore.latitude}
                  onChange={(e) => setNewStore({ ...newStore, latitude: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder={t('longitude')}
                  type="number"
                  value={newStore.longitude}
                  onChange={(e) => setNewStore({ ...newStore, longitude: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder={t('imageUrl')}
                  value={newStore.imageUrl}
                  onChange={(e) => setNewStore({ ...newStore, imageUrl: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleAddStore} data-bs-dismiss="modal">
                  {t('add')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Edit Store */}
        <div className="modal fade" id="editStoreModal" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('editStore')}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                {selectedStore && (
                  <>
                    <input
                      className="form-control mb-2"
                      value={selectedStore.StoreName}
                      onChange={(e) =>
                        setSelectedStore({ ...selectedStore, StoreName: e.target.value })
                      }
                    />
                    <input
                      className="form-control mb-2"
                      value={selectedStore.Address}
                      onChange={(e) =>
                        setSelectedStore({ ...selectedStore, Address: e.target.value })
                      }
                    />
                    <input
                      className="form-control mb-2"
                      type="number"
                      value={selectedStore.Latitude}
                      onChange={(e) =>
                        setSelectedStore({ ...selectedStore, Latitude: Number(e.target.value) })
                      }
                    />
                    <input
                      className="form-control mb-2"
                      type="number"
                      value={selectedStore.Longitude}
                      onChange={(e) =>
                        setSelectedStore({ ...selectedStore, Longitude: Number(e.target.value) })
                      }
                    />
                    <input
                      className="form-control mb-2"
                      value={selectedStore.ImageURL}
                      onChange={(e) =>
                        setSelectedStore({ ...selectedStore, ImageURL: e.target.value })
                      }
                    />
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleUpdateStore} data-bs-dismiss="modal">
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreTable;
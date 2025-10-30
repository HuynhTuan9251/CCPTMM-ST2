import React, { useState } from "react";
import { FaUsers, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import * as bootstrap from 'bootstrap';
import axios from "axios";

type User = {
  MaNguoiDung: string;
  TenNguoiDung: string;
  Email: string;
  VaiTro: string;
};
const UserTable = ({ users, setUsers, fetchUsers }) => {
  const { t } = useTranslation();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const handleAddUser = async () => {
    try {
      const userToAdd = {
        TenNguoiDung: newUser.name,
        Email: newUser.email,
        VaiTro: newUser.role,
      };
      await axios.post("http://localhost:3000/api/auth/users", userToAdd,authHeader);
      await fetchUsers();
      setNewUser({ name: "", email: "", role: "" });
      setMessage(t('addUserSuccess'));
    } catch (error) {
      setMessage(t('addUserError'));
    }
  };

  const handleUpdateUser = async () => {
    try {
      if (!selectedUser) {
        throw new Error(t('userNotFound'));
      }
      const userToUpdate = {
        TenNguoiDung: selectedUser.TenNguoiDung,
        Email: selectedUser.Email,
        VaiTro: selectedUser.VaiTro,
      };
      await axios.put(`http://localhost:3000/api/auth/users/${selectedUser.MaNguoiDung}`, userToUpdate,authHeader);
      await fetchUsers();
      setSelectedUser(null);
      setMessage(t('updateUserSuccess'));
      const editModal = document.getElementById("editUserModal");
      editModal?.classList.remove("show");
      document.body.classList.remove("modal-open");
      document.querySelector(".modal-backdrop")?.remove();
    } catch (error) {
      setMessage(t('updateUserError'));
    }
  };


  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaUsers className="me-2" /> {t('manageUsers')}
        </h5>
        <button className="btn btn-light btn-sm" data-bs-toggle="modal" data-bs-target="#addUserModal">
          <FaPlus /> {t('add')}
        </button>
      </div>
      <div className="card-body">
        {message && (
          <div className="alert alert-info" role="alert">
            {message}
          </div>
        )}
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>{t('userId')}</th>
                <th>{t('name')}</th>
                <th>{t('email')}</th>
                <th>{t('role')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.MaNguoiDung}>
                  <td>{u.MaNguoiDung}</td>
                  <td>{u.TenNguoiDung}</td>
                  <td>{u.Email}</td>
                  <td>{u.VaiTro}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setSelectedUser(u);
                        setTimeout(() => {
                          const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
                          editModal.show();
                        }, 0);
                      }}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm User */}
      <div className="modal fade" id="addUserModal" tabIndex={-1} aria-labelledby="addUserModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addUserModalLabel">{t('addUser')}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">{t('name')}</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{t('email')}</label>
                <input
                  type="email"
                  className="form-control"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{t('role')}</label>
                <input
                  type="text"
                  className="form-control"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t('close')}</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  await handleAddUser();
                  const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
                  modal.hide();
                }}
              >
                {t('add')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Sửa User */}
      <div className="modal fade" id="editUserModal" tabIndex={-1} aria-labelledby="editUserModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editUserModalLabel">{t('editUser')}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedUser && (
                <>
                  <div className="mb-3">
                    <label className="form-label">{t('name')}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser.TenNguoiDung}
                      onChange={(e) => setSelectedUser({ ...selectedUser, TenNguoiDung: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t('email')}</label>
                    <input
                      type="email"
                      className="form-control"
                      value={selectedUser.Email}
                      onChange={(e) => setSelectedUser({ ...selectedUser, Email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t('role')}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser.VaiTro}
                      onChange={(e) => setSelectedUser({ ...selectedUser, VaiTro: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t('close')}</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={async () => {
                  await handleUpdateUser();
                  const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
                  modal.hide();
                }}
                disabled={!selectedUser}
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
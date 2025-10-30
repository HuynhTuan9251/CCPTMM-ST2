import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaShoppingBag, FaSignOutAlt, FaEdit } from "react-icons/fa";
import axios from "axios";
import "./accountsettings.css";

type User = {
  MaNguoiDung: string;
  TenNguoiDung: string;
  SoDienThoai: string;
  Email: string;
};

type Order = {
  MaDonHang: string;
  NgayDatHang: string;
  TongTien: number;
  DiaChi: string;
  TrangThai: string;
};
const AccountSettings = () => {
  const { t, i18n } = useTranslation(); // Thêm i18n để lấy ngôn ngữ hiện tại
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User>({ MaNguoiDung: "", TenNguoiDung: "", SoDienThoai: "", Email: "" });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState<{ MatKhauCu: string; MatKhauMoi: string }>({ MatKhauCu: "", MatKhauMoi: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const fetchUser = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/auth/users/${parsedUser.MaNguoiDung}`, {
            params: { lang: i18n.language },
          });
          const userData = response.data.data;
          setUser(userData);
          setFormData({
            MaNguoiDung: userData.MaNguoiDung,
            TenNguoiDung: userData.TenNguoiDung, 
            SoDienThoai: userData.SoDienThoai || "",
            Email: userData.Email,
          });
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      const fetchOrders = async () => {
        try {
          const storedUser = localStorage.getItem("user");
          const token = storedUser ? JSON.parse(storedUser).token : null;
          const response = await axios.get(`http://localhost:3000/api/orders/customer/${parsedUser.MaNguoiDung}`, {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
            params: { lang: i18n.language },
          });
          setOrders(response.data.data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchUser();
      fetchOrders();
    } else {
      navigate("/");
    }
  }, [navigate, i18n.language]); // Thêm i18n.language vào dependency để cập nhật khi ngôn ngữ thay đổi

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      if (!user) {
        throw new Error("User not found");
      }
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      await axios.put(
        `http://localhost:3000/api/auth/users/${user.MaNguoiDung}`,
        formData,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setUser({ ...user, ...formData });
      localStorage.setItem("user", JSON.stringify({ ...user, ...formData, token }));
      setEditMode(false);
      alert(t("saveChangesSuccess"));
    } catch (error) {
      console.error("Error updating user:", error);
      alert(t("saveChangesError"));
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!user) {
        throw new Error("User not found");
      }
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      const response = await axios.put(
        `http://localhost:3000/api/auth/change-password`,
        passwordData,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      alert(response.data.message || response.data);
      setShowChangePassword(false);
    } catch (error) {
      console.error("Error changing password:", error);
      alert(t("changePasswordError"));
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "1200px" }}>
      <h2 className="text-center mb-5" style={{ fontWeight: "bold", color: "#2c3e50" }}>
        <FaUser className="me-2" /> {t("profile")}
      </h2>

      {user ? (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-lg border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
              <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center" style={{ padding: "15px 20px" }}>
                <h5 className="mb-0">
                  <FaUser className="me-2" /> {t("personalInfo")}
                </h5>
                <button
                  className="btn btn-light btn-sm rounded-circle"
                  onClick={handleEditToggle}
                  style={{ width: "35px", height: "35px", padding: "0" }}
                >
                  <FaEdit />
                </button>
              </div>
              <div className="card-body" style={{ padding: "20px" }}>
                {editMode ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#34495e" }}>
                        {t("name")}:
                      </label>
                      <input
                        type="text"
                        className="form-control shadow-sm"
                        name="TenNguoiDung"
                        value={formData.TenNguoiDung}
                        onChange={handleInputChange}
                        style={{ borderRadius: "10px" }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#34495e" }}>
                        {t("phone")}:
                      </label>
                      <input
                        type="text"
                        className="form-control shadow-sm"
                        name="SoDienThoai"
                        value={formData.SoDienThoai}
                        onChange={handleInputChange}
                        style={{ borderRadius: "10px" }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold" style={{ color: "#34495e" }}>
                        {t("email")}:
                      </label>
                      <input
                        type="email"
                        className="form-control shadow-sm"
                        name="Email"
                        value={formData.Email}
                        onChange={handleInputChange}
                        style={{ borderRadius: "10px" }}
                      />
                    </div>
                    <button
                      className="btn btn-success w-100 shadow-sm"
                      onClick={handleUpdate}
                      style={{ borderRadius: "10px", padding: "10px" }}
                    >
                      {t("saveChanges")}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mb-2" style={{ fontSize: "16px", color: "#34495e" }}>
                      <strong>{t("email")}:</strong> {user.Email}
                    </p>
                    <p className="mb-2" style={{ fontSize: "16px", color: "#34495e" }}>
                      <strong>{t("name")}:</strong> {user.TenNguoiDung}
                    </p>
                    <p className="mb-2" style={{ fontSize: "16px", color: "#34495e" }}>
                      <strong>{t("phone")}:</strong> {user.SoDienThoai || t("notUpdated")}
                    </p>
                    <p className="mb-4" style={{ fontSize: "16px", color: "#34495e" }}>
                      <strong>{t("customerId")}:</strong> {user.MaNguoiDung}
                    </p>
                    <button
                      className="btn btn-warning w-100 mb-3 shadow-sm"
                      onClick={() => setShowChangePassword(true)}
                      style={{ borderRadius: "10px", padding: "10px" }}
                    >
                      {t("changePassword")}
                    </button>
                    <button
                      className="btn btn-danger w-100 shadow-sm"
                      onClick={handleLogout}
                      style={{ borderRadius: "10px", padding: "10px" }}
                    >
                      <FaSignOutAlt className="me-2" /> {t("logout")}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card shadow-lg border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
              <div className="card-header bg-gradient-success text-white" style={{ padding: "15px 20px" }}>
                <h5 className="mb-0">
                  <FaShoppingBag className="me-2" /> {t("orders")}
                </h5>
              </div>
              <div className="card-body" style={{ padding: "20px" }}>
                {orders.length === 0 ? (
                  <div className="alert alert-info text-center shadow-sm" style={{ borderRadius: "10px", fontSize: "16px" }}>
                    {t("noOrders")}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                      <thead style={{ backgroundColor: "#ecf0f1", color: "#2c3e50" }}>
                        <tr>
                          <th>{t("orderId")}</th>
                          <th>{t("orderDate")}</th>
                          <th>{t("totalAmount")}</th>
                          <th>{t("address")}</th>
                          <th>{t("status")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order.MaDonHang}
                            style={{ transition: "background-color 0.2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                          >
                            <td>{order.MaDonHang}</td>
                            <td>{new Date(order.NgayDatHang).toLocaleDateString("vi-VN")}</td>
                            <td>{order.TongTien.toLocaleString("vi-VN")} VND</td>
                            <td>{order.DiaChi}</td>
                            <td>
                              <span
                             className={`badge ${
                              order.TrangThai === t("ship") || order.TrangThai === "Completed"
                                ? "bg-success"
                                : "bg-warning"
                            }`}
                            
                                style={{ padding: "8px 12px", fontSize: "14px", borderRadius: "20px" }}
                              >
                                {order.TrangThai} {/* Trạng thái đã được backend dịch */}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning text-center shadow-sm" style={{ borderRadius: "10px", fontSize: "16px" }}>
          {t("noUserInfo")}
        </div>
      )}

      {showChangePassword && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg" style={{ borderRadius: "15px", overflow: "hidden" }}>
              <div className="modal-header bg-gradient-primary text-white" style={{ padding: "15px 20px" }}>
                <h5 className="modal-title">{t("changePassword")}</h5>
                <button
                  type="button"
                  className="btn-close bg-white"
                  onClick={() => setShowChangePassword(false)}
                ></button>
              </div>
              <div className="modal-body" style={{ padding: "20px" }}>
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: "#34495e" }}>
                    {t("oldPassword")}:
                  </label>
                  <input
                    type="password"
                    className="form-control shadow-sm"
                    name="MatKhauCu"
                    value={passwordData.MatKhauCu}
                    onChange={(e) => setPasswordData({ ...passwordData, MatKhauCu: e.target.value })}
                    style={{ borderRadius: "10px" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: "#34495e" }}>
                    {t("newPassword")}:
                  </label>
                  <input
                    type="password"
                    className="form-control shadow-sm"
                    name="MatKhauMoi"
                    value={passwordData.MatKhauMoi}
                    onChange={(e) => setPasswordData({ ...passwordData, MatKhauMoi: e.target.value })}
                    style={{ borderRadius: "10px" }}
                  />
                </div>
              </div>
              <div className="modal-footer" style={{ padding: "15px 20px" }}>
                <button
                  type="button"
                  className="btn btn-secondary shadow-sm"
                  onClick={() => setShowChangePassword(false)}
                  style={{ borderRadius: "10px", padding: "10px 20px" }}
                >
                  {t("close")}
                </button>
                <button
                  type="button"
                  className="btn btn-primary shadow-sm"
                  onClick={handleChangePassword}
                  style={{ borderRadius: "10px", padding: "10px 20px" }}
                >
                  {t("changePassword")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
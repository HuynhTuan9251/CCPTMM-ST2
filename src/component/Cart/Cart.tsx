import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTrash, FaShoppingCart, FaMoneyBillWave, FaCreditCard, FaMapMarkerAlt, FaPlus, FaMinus } from "react-icons/fa";
import axios from "axios";
import "./Cart.css";

type CartItem = {
  MaSanPham: string;
  TenSanPham: string;
  Gia: number;
  SoLuong: number;
  HinhAnh: string;
};

const Cart = () => {
  const { t } = useTranslation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [shippingAddress, setShippingAddress] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ type: string; message: string } | null>(null);
  const shippingFee = 15000;
  const [maKhachHang] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.MaNguoiDung;
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!token || !user.MaNguoiDung) {
          console.error('No token or user found');
          return;
        }
        
        const response = await axios.get(`http://localhost:3000/api/cart/${user.MaNguoiDung}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data.data || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [maKhachHang]);

  const showAlert = (type: string, message: string) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const removeItem = async (maSanPham: string) => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !user.MaNguoiDung) {
        showAlert('warning', t('pleaseLoginFirst'));
        return;
      }
      
      const response = await axios.delete(`http://localhost:3000/api/cart/${user.MaNguoiDung}/${maSanPham}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const newCart = cart.filter((item) => item.MaSanPham !== maSanPham);
        setCart(newCart);
        showAlert('success', t('removeItemSuccess'));
      }
    } catch (error) {
      console.error("Error removing item:", error);
      if (error.response?.status === 401) {
        showAlert('warning', t('pleaseLoginFirst'));
      } else {
        showAlert('danger', t('removeItemError'));
      }
    }
  };

  const updateQuantity = async (maSanPham: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(maSanPham);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !user.MaNguoiDung) {
        showAlert('warning', t('pleaseLoginFirst'));
        return;
      }
      
      const response = await axios.put(`http://localhost:3000/api/cart/${user.MaNguoiDung}/${maSanPham}`, {
        SoLuong: newQuantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 200) {
        const updatedCart = cart.map((item) =>
          item.MaSanPham === maSanPham ? { ...item, SoLuong: newQuantity } : item
        );
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      if (error.response?.status === 401) {
        showAlert('warning', t('pleaseLoginFirst'));
      } else {
        showAlert('danger', t('updateQuantityError'));
      }
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.Gia || 0) * item.SoLuong, 0);
  const finalTotal = total + shippingFee;

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t('browserNotSupportLocation')); // Thêm key
      return;
    }

    setLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const address = response.data.display_name;
          setShippingAddress(address);
        } catch (error) {
          console.error("Error fetching address:", error);
          setLocationError(t('fetchAddressError')); // Thêm key
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError(t('getLocationError')); // Thêm key
        setLoadingLocation(false);
      }
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showAlert('warning', t('emptyCart'));
      return;
    }

 // Kiểm tra địa chỉ giao hàng hợp lệ
const trimmedAddress = shippingAddress.trim();

// 1. Kiểm tra rỗng
if (!trimmedAddress) {
  showAlert('warning', t('enterShippingAddress'));
  return;
}

// 2. Kiểm tra độ dài tối thiểu
if (trimmedAddress.length < 5) {
  showAlert('warning', t('Địa chỉ quá ngắn, vui lòng nhập chi tiết hơn'));
  return;
}

// 3. Kiểm tra địa chỉ có chứa ký tự chữ và số (ví dụ: "123 Đường Lê Lợi")
const hasLetter = /[A-Za-zÀ-ỹ]/.test(trimmedAddress);
const hasNumber = /\d/.test(trimmedAddress);
if (!hasLetter || !hasNumber) {
  showAlert('warning', t('Địa chỉ phải chứa cả số nhà và tên đường'));
  return;
}


    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showAlert('warning', t('pleaseLoginFirst'));
        return;
      }
      // Đặt headers cho mọi request
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      const donHangResponse = await axios.post("http://localhost:3000/api/orders", {
        MaKhachHang: maKhachHang,
        TongTien: finalTotal,
        DiaChi: shippingAddress,
        TrangThai: "Đang giao",
      }, headers);
      const MaDonHang = donHangResponse.data.data?.MaDonHang;

      await Promise.all(
        cart.map((item) =>
          axios.post("http://localhost:3000/api/order-details", {
            MaDonHang: MaDonHang,
            MaSanPham: item.MaSanPham,
            SoLuong: item.SoLuong,
            DonGia: item.Gia,
          }, headers)
        )
      );

      const maPhuongThuc = paymentMethod === "cash" ? 1 : 2;
      const thanhToanResponse = await axios.post("http://localhost:3000/api/payments", {
        MaDonHang: MaDonHang,
        MaPhuongThuc: maPhuongThuc,
        SoTien: finalTotal,
        TrangThai: "Chưa thanh toán",
      }, headers);
      const { MaThanhToan } = thanhToanResponse.data;

      await Promise.all(
        cart.map((item) => axios.delete(`http://localhost:3000/api/cart/${maKhachHang}/${item.MaSanPham}`, headers))
      );

      setCart([]);
      setShippingAddress("");

      if (paymentMethod === "cash") {
        const message = `${t('cashPaymentSuccess')} 🎉\n${t('orderId')}: ${MaDonHang}\n${t('paymentId')}: ${MaThanhToan}\n${t('deliveryTo')}:\n📍 ${shippingAddress}`;
        showAlert('success', message);
      } else {
        const message = `${t('bankTransferInstruction')}:\n💳 ${t('bank')}: ABC Bank\n🔢 ${t('accountNumber')}: 123456789\n📌 ${t('content')}: ${t('paymentForOrder')} ${MaDonHang}\n📍 ${t('deliveryTo')}: ${shippingAddress}\n${t('paymentId')}: ${MaThanhToan}`;
        showAlert('success', message);
      }
    } catch (error) {
      console.error("Error during checkout:", error.response?.data || error.message);
      showAlert('danger', t('checkoutError'));
    }
  };

  // Kiểm tra nếu người dùng chưa đăng nhập
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token || !user.MaNguoiDung) {
    return (
      <div className="container mt-5" style={{ maxWidth: "1000px" }}>
        <div className="alert alert-warning text-center shadow-sm" style={{ borderRadius: "15px", fontSize: "16px", padding: "20px" }}>
          <h4 className="mb-3">🔒 {t('accessDenied')}</h4>
          <p className="mb-3">{t('pleaseLoginToAccessCart')}</p>
          <a href="/login" className="btn btn-primary">
            {t('goToLogin')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "1000px" }}>
      <h2 className="text-center mb-5" style={{ fontWeight: "bold", color: "#2c3e50" }}>
        <FaShoppingCart className="me-2" /> {t('yourCart')}
      </h2>

      {alertMessage && (
        <div className={`alert alert-${alertMessage.type} alert-dismissible fade show`} role="alert" style={{ whiteSpace: 'pre-wrap' }}>
          {alertMessage.message}
          <button type="button" className="btn-close" onClick={() => setAlertMessage(null)} aria-label="Close"></button>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="alert alert-warning text-center shadow-sm" style={{ borderRadius: "15px", fontSize: "16px", padding: "20px" }}>
          {t('emptyCart')}
        </div>
      ) : (
        <div className="card shadow-lg border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
          <div className="card-body p-4">
            {cart.map((item) => (
              <div key={item.MaSanPham} className="d-flex justify-content-between align-items-center border-bottom py-3" style={{ transition: "background-color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <div className="d-flex align-items-center">
                  <img src={item.HinhAnh || "default-image.jpg"} alt={item.TenSanPham} className="rounded shadow-sm me-3" style={{ width: "60px", height: "60px", objectFit: "cover" }} />
                  <div>
                    <h6 className="mb-1" style={{ fontWeight: "600", color: "#34495e" }}>{item.TenSanPham}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: "14px" }}>{(item.Gia || 0).toLocaleString("vi-VN")} VND</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center">
                  {/* Quantity Controls */}
                  <div className="d-flex align-items-center me-3">
                    <button 
                      className="btn btn-outline-secondary btn-sm rounded-circle" 
                      onClick={() => updateQuantity(item.MaSanPham, item.SoLuong - 1)}
                      style={{ width: "30px", height: "30px", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <FaMinus style={{ fontSize: "10px" }} />
                    </button>
                    <span className="mx-3" style={{ minWidth: "30px", textAlign: "center", fontWeight: "600", fontSize: "16px" }}>
                      {item.SoLuong}
                    </span>
                    <button 
                      className="btn btn-outline-primary btn-sm rounded-circle" 
                      onClick={() => updateQuantity(item.MaSanPham, item.SoLuong + 1)}
                      style={{ width: "30px", height: "30px", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <FaPlus style={{ fontSize: "10px" }} />
                    </button>
                  </div>
                  
                  {/* Total price for this item */}
                  <div className="me-3" style={{ minWidth: "100px", textAlign: "right" }}>
                    <span style={{ fontWeight: "600", color: "#2c3e50", fontSize: "16px" }}>
                      {((item.Gia || 0) * item.SoLuong).toLocaleString("vi-VN")} VND
                    </span>
                  </div>
                  
                  {/* Remove button */}
                  <button className="btn btn-danger btn-sm rounded-circle shadow-sm" onClick={() => removeItem(item.MaSanPham)} style={{ width: "35px", height: "35px", padding: "0" }}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}

            <div className="border-top pt-4 mt-3">
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontWeight: "500", color: "#34495e" }}>{t('subtotal')}:</span>
                <span style={{ fontWeight: "600" }}>{total.toLocaleString("vi-VN")} VND</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontWeight: "500", color: "#34495e" }}>{t('shippingFee')}:</span>
                <span style={{ fontWeight: "600" }}>{shippingFee.toLocaleString("vi-VN")} VND</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="fs-5 fw-bold" style={{ color: "#2c3e50" }}>{t('finalTotal')}:</span>
                <span className="fs-5 fw-bold text-primary">{finalTotal.toLocaleString("vi-VN")} VND</span>
              </div>

              <div className="mb-4">
                <h5 className="mb-2" style={{ fontWeight: "600", color: "#2c3e50" }}>
                  <FaMapMarkerAlt className="me-2" /> {t('shippingAddress')}
                </h5>
                <div className="input-group">
                  <input type="text" className="form-control shadow-sm" placeholder={t('enterShippingAddress')} value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} style={{ borderRadius: "10px 0 0 10px", padding: "12px" }} />
                  <button className="btn btn-outline-primary" onClick={getCurrentLocation} disabled={loadingLocation} style={{ borderRadius: "0 10px 10px 0" }}>
                    {loadingLocation ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      <FaMapMarkerAlt className="me-2" />
                    )}
                    {loadingLocation ? t('gettingLocation') : t('getLocation')} {/* Thêm key 'gettingLocation' */}
                  </button>
                </div>
                {locationError && (
                  <div className="text-danger mt-2" style={{ fontSize: "14px" }}>{locationError}</div>
                )}
              </div>

              <div className="mb-4">
                <h5 className="mb-3" style={{ fontWeight: "600", color: "#2c3e50" }}>{t('paymentMethod')}</h5>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="paymentMethod" id="cash" value="cash" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} />
                  <label className="form-check-label" htmlFor="cash" style={{ fontSize: "16px", color: "#34495e" }}>
                    <FaMoneyBillWave className="me-2 text-success" /> {t('cash')}
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="paymentMethod" id="bank" value="bank" checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} />
                  <label className="form-check-label" htmlFor="bank" style={{ fontSize: "16px", color: "#34495e" }}>
                    <FaCreditCard className="me-2 text-primary" /> {t('bankTransfer')}
                  </label>
                </div>
              </div>

              <button className="btn btn-success w-100 shadow-sm" onClick={handleCheckout} style={{ borderRadius: "10px", padding: "12px", fontSize: "16px", fontWeight: "500", background: "linear-gradient(45deg, #28a745, #48bb78)", border: "none" }}>
                🛍 {t('checkout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
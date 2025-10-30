import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OrderTable from "./OrderTable";
import PayTable from "./PayTable"; // Import PayTable
import UserTable from "./UserTable";
import ProductTable from "./ProductTable";
import StoreTable from "./StoreTable";
import NewsTable from "./NewsTable";
import NewsDetailTable from "./NewsDetailTable";
import Sidebar from "./Sidebar";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {  
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]); 
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [news, setNews] = useState<News[]>([]); 
  const [newsDetails, setNewsDetails] = useState<NewsDetail[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  type Order = {
    MaDonHang: string;
    MaKhachHang: string;
    TongTien: number;
    DiaChi: string;
    TrangThai: string;
  };

  type Payment = {
    MaDonHang: string;
    MaKhachHang: string;
    TongTien: number;
    DiaChi: string;
    TrangThai: string;
  };

  type User = {
    MaNguoiDung: string;
    TenNguoiDung: string;
    Email: string;
    SoDienThoai: string;
  };

  type Product = {
    MaSanPham: string;
    TenSanPham: string;
    Gia: number;
    HinhAnh: string;
  };

  type Store = {
    MaCuaHang: string;
    TenCuaHang: string;
    DiaChi: string;
  };

  type News = {
    MaTinTuc: string;
    TenTinTuc: string;
    NoiDung: string;
  };

  // Đúng interface NewsDetail
  type NewsDetail = {
    id: number;
    tin_tuc_id: number;
    noi_dung: string;
    danh_sach_san_pham: string;
    ma_khuyen_mai: string;
    thoi_gian_ap_dung: string;
    lien_ket: string;
    hinh_anh: string;
  };


  const fetchOrders = async () => {
    const response = await axios.get("http://localhost:3000/api/orders", authHeader);
    setOrders(response.data.data || []);
    setTotalRevenue((response.data.data || []).reduce((sum, order) => sum + order.TongTien, 0));
  };

  const fetchPayments = async () => {
    const response = await axios.get("http://localhost:3000/api/payments", authHeader);
    setPayments(response.data.data || []);
  };

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:3000/api/auth/users", authHeader);
    setUsers(response.data.data || []);
  };

  const fetchProducts = async () => {
    const response = await axios.get("http://localhost:3000/api/products", authHeader);
    setProducts(response.data.data || []);
  };

  const fetchStores = async () => {
    const response = await axios.get("http://localhost:3000/api/stores", authHeader);
    setStores(response.data.data || []);
  };

  const fetchNews = async () => {
    const response = await axios.get("http://localhost:3000/api/news", authHeader);
    setNews(response.data.data || []);
  };

  const fetchNewsDetails = async () => {
    const response = await axios.get("http://localhost:3000/api/news-details/all", authHeader);
    setNewsDetails(response.data.data || []);
  };

  useEffect(() => {
    fetchOrders();
    fetchPayments();
    fetchUsers();
    fetchProducts();
    fetchStores();
    fetchNews();
    fetchNewsDetails();
  }, []);

  const handleUpdateOrderStatus = async (MaDonHang, newStatus) => {
 
    try {
      await axios.put(`http://localhost:3000/api/orders/${MaDonHang}/status`, {
        TrangThai: newStatus,
      },authHeader);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.MaDonHang === MaDonHang ? { ...order, TrangThai: newStatus } : order
        )
      );
      const updatedOrders = orders.map((order) =>
        order.MaDonHang === MaDonHang ? { ...order, TrangThai: newStatus } : order
      );
      setTotalRevenue(updatedOrders.reduce((sum, order) => sum + order.TongTien, 0));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleUpdatePaymentStatus = async (MaDonHang, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/payments/${MaDonHang}/status`, {
        TrangThai: newStatus,
      },authHeader );
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.MaDonHang === MaDonHang ? { ...payment, TrangThai: newStatus } : payment
        )
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleDeleteUser = async (MaNguoiDung) => {
    try {
     await axios.delete(`http://localhost:3000/api/auth/users/${MaNguoiDung}`,authHeader);
      setUsers((prevUsers) => prevUsers.filter((user) => user.MaNguoiDung !== MaNguoiDung));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteNewsDetail = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/news-details/${id}`,authHeader);
      setNewsDetails((prevNewsDetails) => prevNewsDetails.filter((newsDetail) => newsDetail.id !== id));
    } catch (error) {
      console.error("Error deleting news detail:", error);
    }
  };


    return (
    <div className="container-fluid mt-5 d-flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="content p-4 flex-grow-1">
        <h2 className="text-center mb-4">{t("adminDashboardTitle")}</h2>
        {activeTab === "orders" && (
          <OrderTable
            orders={orders}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            totalRevenue={totalRevenue}
          />
        )}
        {activeTab === "payments" && (
          <PayTable payments={payments} handleUpdatePaymentStatus={handleUpdatePaymentStatus} />
        )}
        {activeTab === "users" && <UserTable users={users} setUsers={setUsers} fetchUsers={fetchUsers} />}  
        {activeTab === "products" && <ProductTable products={products} setProducts={setProducts} fetchProducts={fetchProducts} />}
        {activeTab === "stores" && <StoreTable stores={stores} setStores={setStores} fetchStores={fetchStores} />}
        {activeTab === "news" && <NewsTable news={news} setNews={setNews} fetchNews={fetchNews} />}
        {activeTab === "newsDetails" && (
          <NewsDetailTable newsDetails={newsDetails} setNewsDetails={setNewsDetails} news={news} handleDeleteNewsDetail={handleDeleteNewsDetail} fetchNewsDetails={fetchNewsDetails} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
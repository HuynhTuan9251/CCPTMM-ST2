import React from "react";
import { useTranslation } from "react-i18next";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  return (
    <div className="sidebar bg-light p-3" style={{ width: "250px", minHeight: "100vh" }}>
      <h4>{t("adminPanel")}</h4>
      <ul className="list-group">
        <li
          className={`list-group-item ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
          style={{ cursor: "pointer" }}
        >
          {t("orders")}
        </li>
        <li
          className={`list-group-item ${activeTab === "payments" ? "active" : ""}`}
          onClick={() => setActiveTab("payments")}
          style={{ cursor: "pointer" }}
        >
          {t("payments")}
        </li>
        <li
          className={`list-group-item ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
          style={{ cursor: "pointer" }}
        >
          {t("users")}
        </li>
        <li
          className={`list-group-item ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
          style={{ cursor: "pointer" }}
        >
          {t("products")}
        </li>
        <li
          className={`list-group-item ${activeTab === "stores" ? "active" : ""}`}
          onClick={() => setActiveTab("stores")}
          style={{ cursor: "pointer" }}
        >
          {t("stores")}
        </li>
        <li
          className={`list-group-item ${activeTab === "news" ? "active" : ""}`}
          onClick={() => setActiveTab("news")}
          style={{ cursor: "pointer" }}
        >
          {t("news")}
        </li>
        <li
          className={`list-group-item ${activeTab === "newsDetails" ? "active" : ""}`}
          onClick={() => setActiveTab("newsDetails")}
          style={{ cursor: "pointer" }}
        >
          {t("newsDetails")}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
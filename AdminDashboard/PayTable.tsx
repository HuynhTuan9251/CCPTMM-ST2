import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const PayTable = ({ payments, handleUpdatePaymentStatus }) => {
  const { t } = useTranslation();

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">
          <FaMoneyBillWave className="me-2" /> {t("payments")}
        </h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>{t("paymentId")}</th>
                <th>{t("orderId")}</th>
                <th>{t("paymentMethod")}</th>
                <th>{t("amount")}</th>
                <th>{t("status")}</th>
                <th>{t("paymentDate")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.MaThanhToan}>
                  <td>{payment.MaThanhToan}</td>
                  <td>{payment.MaDonHang}</td>
                  <td>
  {(() => {
    if (payment.MaPhuongThuc === 1) {
      return t("cash");
    } else {
      return t("bankTransfer");
    }
  })()}
</td>
<td>
  {(() => {
    if (payment.MaPhuongThuc === 1) {
      return t("cash");
    } else {
      return t("bankTransfer");
    }
  })()}
</td>

                  <td>{payment.SoTien.toLocaleString()} VND</td>
                  <td>
                    <span
                      className={`badge ${
                        payment.TrangThai === "Thanh toán thành công" ? "bg-success" : "bg-warning"
                      }`}
                    >
                      {payment.TrangThai}
                    </span>
                  </td>
                  <td>
                    {payment.NgayThanhToan
                      ? new Date(payment.NgayThanhToan).toLocaleDateString()
                      : t("notAvailable")}
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={payment.TrangThai}
                      onChange={(e) =>
                        handleUpdatePaymentStatus(payment.MaDonHang, e.target.value)
                      }
                    >
                      <option value="Chưa thành công">{t("notPaid")}</option>
                      <option value="Thanh toán thành công">{t("paid")}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayTable;
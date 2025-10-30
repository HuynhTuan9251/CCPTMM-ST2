import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./newsDetails.css";

// Define the interface for news detail
interface NewsDetail {
  id: number;
  TieuDe: string;
  NoiDung?: string;
  HinhAnh?: string;
  DanhSachSanPham?: string;
  MaKhuyenMai?: string;
  ThoiGianApDung?: string;
  LienKet?: string;
  date?: string;
}

const ChiTietTinTuc = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [chiTiet, setChiTiet] = useState<NewsDetail | null>(null);

  useEffect(() => {
    const fetchChiTietTinTuc = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/news-details/${id}`);
        const data = await response.json();
        const formattedData: NewsDetail[] = data.data.map((item: any) => ({
          id: item.id,
          TieuDe: item.tieu_de,
          NoiDung: item.noi_dung,
          HinhAnh: item.hinh_anh,
          DanhSachSanPham: item.danh_sach_san_pham,
          MaKhuyenMai: item.ma_khuyen_mai,
          ThoiGianApDung: item.thoi_gian_ap_dung,
          LienKet: item.lien_ket,
          date: item.ngay_tao ? new Date(item.ngay_tao).toLocaleDateString('vi-VN') : undefined,
        }));
        if (formattedData.length > 0) {
          setChiTiet(formattedData[0]);
        } else {
          setChiTiet(null);
        }
      } catch (error) {
        console.error("Error fetching news detail:", error);
      }
    };

    fetchChiTietTinTuc();
  }, [id, i18n.language]);

  if (!chiTiet) return <p className="text-center">{t('newsNotFound')}</p>;

  return (
    <div className="chitiet-page">
      <div className="chitiet-container">
        <h2 style={{ marginBottom: "30px" }}>{chiTiet.TieuDe || t('newsDetail')}</h2>
        <div>
          <p>{chiTiet.NoiDung}</p>
          {chiTiet.HinhAnh && (
            <figure className="kg-image-card">
              <img src={chiTiet.HinhAnh} alt={t('newsDetail')} className="kg-image" />
            </figure>
          )}
          {chiTiet.DanhSachSanPham && (
            <p><strong>{t('selectProduct')}</strong> {chiTiet.DanhSachSanPham}</p>
          )}
          {chiTiet.MaKhuyenMai && (
            <p>🔸 <strong>{t('promoCode')}</strong> {chiTiet.MaKhuyenMai}</p>
          )}
          {chiTiet.ThoiGianApDung && (
            <p>🔸 <strong>{t('validTime')}</strong> {chiTiet.ThoiGianApDung}</p>
          )}
          <p>{t('deliveryCondition')}</p>
          <p>{t('orderNow')}</p>
          <p>---</p>
          <p><strong>{t('coffeeInvitation')}</strong></p>
          {chiTiet.LienKet && (
            <p>👉 <a href={chiTiet.LienKet} target="_blank" rel="noopener noreferrer">{chiTiet.LienKet}</a></p>
          )}
          <p>👉 {t('phone')}: 18006936</p>
        </div>
      </div>
    </div>
  );
};

export default ChiTietTinTuc;
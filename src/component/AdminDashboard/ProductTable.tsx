import React, { useState } from "react";
import { FaBox, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import * as bootstrap from 'bootstrap';

type Product = {
  MaSanPham: string;
  TenSanPham: string;
  Gia: number;
  MaLoaiSanPham: string;  
  MoTa: string;
  HinhAnh: string;
};

const ProductTable = ({ products, setProducts, fetchProducts }) => {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    TenSanPham: "",
    Gia: "",
    MaLoaiSanPham: "",
    MoTa: "",
    HinhAnh: "",
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };
  const handleAddProduct = async () => {
    try {
      const productToAdd = { ...newProduct, Gia: Number(newProduct.Gia) };
      const res = await axios.post("http://localhost:3000/api/products", productToAdd,authHeader);
      await fetchProducts();
      setNewProduct({ TenSanPham: "", Gia: "", MaLoaiSanPham: "", MoTa: "", HinhAnh: "" });
      setMessage(t('addProductSuccess'));
      const addModal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
      addModal.hide();
    } catch (error) {
      setMessage(t('addProductError') + error.message);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      if (!selectedProduct) {
        throw new Error(t('productNotFound'));
      }
      const productToUpdate = { ...selectedProduct, Gia: Number(selectedProduct.Gia) };
      await axios.put(`http://localhost:3000/api/products/${selectedProduct.MaSanPham}`, productToUpdate,authHeader);
      await fetchProducts();
      setSelectedProduct(null);
      setMessage(t('updateProductSuccess'));
      const editModal = bootstrap.Modal.getInstance(document.getElementById("editProductModal"));
      editModal.hide();
    } catch (error) {
      setMessage(t('updateProductError') + error.message);
    }
  };

  const handleDeleteProduct = async (MaSanPham) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${MaSanPham}`,authHeader);
      await fetchProducts();
      setMessage(t('deleteProductSuccess'));
    } catch (error) {
      setMessage(t('deleteProductError') + error.message);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaBox className="me-2" /> {t('manageProducts')}
        </h5>
        <button className="btn btn-light btn-sm" data-bs-toggle="modal" data-bs-target="#addProductModal">
          <FaPlus /> {t('add')}
        </button>
      </div>
      <div className="card-body">
        {message && <div className="alert alert-info">{message}</div>}
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>{t('productId')}</th>
                <th>{t('productName')}</th>
                <th>{t('price')}</th>
                <th>{t('category')}</th>
                <th>{t('description')}</th>
                <th>{t('image')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.MaSanPham}>
                  <td>{p.MaSanPham}</td>
                  <td>{p.TenSanPham}</td>
                  <td>{p.Gia.toLocaleString()} VND</td>
                  <td>{p.MaLoaiSanPham}</td>
                  <td>{p.MoTa}</td>
                  <td>
                    <img src={p.HinhAnh} alt={p.TenSanPham} width="50" height="50" />
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#editProductModal"
                      onClick={() => setSelectedProduct(p)}
                    >
                      <FaEdit />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p.MaSanPham)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal Add Product */}
          <div className="modal fade" id="addProductModal" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t('addProduct')}</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    placeholder={t('productName')}
                    value={newProduct.TenSanPham}
                    onChange={(e) => setNewProduct({ ...newProduct, TenSanPham: e.target.value })}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder={t('price')}
                    type="number"
                    value={newProduct.Gia}
                    onChange={(e) => setNewProduct({ ...newProduct, Gia: e.target.value })}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder={t('category')}
                    value={newProduct.MaLoaiSanPham}
                    onChange={(e) => setNewProduct({ ...newProduct, MaLoaiSanPham: e.target.value })}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder={t('description')}
                    value={newProduct.MoTa}
                    onChange={(e) => setNewProduct({ ...newProduct, MoTa: e.target.value })}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder={t('imageUrl')}
                    value={newProduct.HinhAnh}
                    onChange={(e) => setNewProduct({ ...newProduct, HinhAnh: e.target.value })}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={handleAddProduct} data-bs-dismiss="modal">
                    {t('add')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Edit Product */}
          <div className="modal fade" id="editProductModal" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t('editProduct')}</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  {selectedProduct && (
                    <>
                      <input
                        className="form-control mb-2"
                        value={selectedProduct.TenSanPham}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, TenSanPham: e.target.value })}
                      />
                      <input
                        className="form-control mb-2"
                        type="number"
                        value={selectedProduct.Gia}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, Gia: Number(e.target.value) || 0     })}
                      />
                      <input
                        className="form-control mb-2"
                        value={selectedProduct.MaLoaiSanPham}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, MaLoaiSanPham: e.target.value })}
                      />
                      <input
                        className="form-control mb-2"
                        value={selectedProduct.MoTa}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, MoTa: e.target.value })}
                      />
                      <input
                        className="form-control mb-2"
                        value={selectedProduct.HinhAnh}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, HinhAnh: e.target.value })}
                      />
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={handleUpdateProduct} data-bs-dismiss="modal">
                    {t('save')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
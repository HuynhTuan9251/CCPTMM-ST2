const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

const validateUser = [
  body('TenNguoiDung').notEmpty().withMessage('Tên người dùng là bắt buộc'),
  body('Email').isEmail().withMessage('Email không hợp lệ'),
  body('MatKhau').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  handleValidationErrors
];

const validateLogin = [
  body('Email').isEmail().withMessage('Email không hợp lệ'),
  body('MatKhau').notEmpty().withMessage('Mật khẩu là bắt buộc'),
  handleValidationErrors
];

const validateProduct = [
  body('TenSanPham').notEmpty().withMessage('Tên sản phẩm là bắt buộc'),
  body('Gia').isNumeric().withMessage('Giá phải là số'),
  body('MaLoaiSanPham').isNumeric().withMessage('Mã loại sản phẩm phải là số'),
  handleValidationErrors
];

const validateOrder = [
  body('MaKhachHang').isNumeric().withMessage('Mã khách hàng phải là số'),
  body('TongTien').isNumeric().withMessage('Tổng tiền phải là số'),
  body('DiaChi').notEmpty().withMessage('Địa chỉ là bắt buộc'),
  handleValidationErrors
];

module.exports = {
  validateUser,
  validateLogin,
  validateProduct,
  validateOrder,
  handleValidationErrors
}; 
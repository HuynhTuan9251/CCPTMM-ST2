# Cafe Backend API

Backend API cho ứng dụng Cafe Web được xây dựng với Node.js, Express.js và SQL Server.

## Cấu trúc thư mục

```
backend/
├── config/           # Cấu hình database, environment
├── controllers/      # Logic xử lý business
├── middleware/       # Middleware (auth, validation, error handling)
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic services
├── utils/           # Utilities (logger, translate)
├── server.js        # Entry point
├── package.json     # Dependencies
└── env.example      # Environment variables template
```

## Tính năng

- **Authentication & Authorization**: JWT, Passport.js, OAuth (GitHub, Google)
- **Database**: SQL Server với connection pooling
- **Security**: Helmet, CORS, Input validation
- **Logging**: Winston logger
- **Internationalization**: Google Translate API
- **Error Handling**: Centralized error handling
- **Validation**: Express-validator

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin profile
- `PUT /api/auth/change-password` - Đổi mật khẩu
- `POST /api/auth/logout` - Đăng xuất

### Products
- `GET /api/products` - Lấy tất cả sản phẩm
- `GET /api/products/:id` - Lấy sản phẩm theo ID
- `GET /api/products/category/:categoryId` - Lấy sản phẩm theo loại
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Orders
- `GET /api/orders` - Lấy tất cả đơn hàng (Admin)
- `GET /api/orders/:id` - Lấy đơn hàng theo ID
- `GET /api/orders/customer/:customerId` - Lấy đơn hàng theo khách hàng
- `POST /api/orders` - Tạo đơn hàng
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng (Admin)
- `DELETE /api/orders/:id` - Xóa đơn hàng (Admin)

### Cart
- `GET /api/cart/:customerId` - Lấy giỏ hàng của khách hàng
- `POST /api/cart` - Thêm sản phẩm vào giỏ hàng
- `PUT /api/cart/:customerId/:productId` - Cập nhật số lượng sản phẩm
- `DELETE /api/cart/:customerId/:productId` - Xóa sản phẩm khỏi giỏ hàng
- `DELETE /api/cart/:customerId` - Xóa toàn bộ giỏ hàng

### Categories
- `GET /api/categories` - Lấy tất cả loại sản phẩm
- `GET /api/categories/:id` - Lấy loại sản phẩm theo ID
- `POST /api/categories` - Tạo loại sản phẩm (Admin)
- `PUT /api/categories/:id` - Cập nhật loại sản phẩm (Admin)
- `DELETE /api/categories/:id` - Xóa loại sản phẩm (Admin)

### Payments
- `GET /api/payments` - Lấy tất cả thanh toán (Admin)
- `GET /api/payments/:id` - Lấy thanh toán theo ID
- `GET /api/payments/order/:orderId` - Lấy thanh toán theo đơn hàng
- `POST /api/payments` - Tạo thanh toán
- `PUT /api/payments/:orderId/status` - Cập nhật trạng thái thanh toán (Admin)
- `DELETE /api/payments/:id` - Xóa thanh toán (Admin)

### Order Details
- `GET /api/order-details` - Lấy tất cả chi tiết đơn hàng (Admin)
- `GET /api/order-details/:id` - Lấy chi tiết đơn hàng theo ID
- `GET /api/order-details/order/:orderId` - Lấy chi tiết theo đơn hàng
- `POST /api/order-details` - Tạo chi tiết đơn hàng
- `PUT /api/order-details/:id` - Cập nhật chi tiết đơn hàng
- `DELETE /api/order-details/:id` - Xóa chi tiết đơn hàng (Admin)

### News
- `GET /api/news` - Lấy tất cả tin tức
- `GET /api/news/:id` - Lấy tin tức theo ID
- `POST /api/news` - Tạo tin tức (Admin)
- `PUT /api/news/:id` - Cập nhật tin tức (Admin)
- `DELETE /api/news/:id` - Xóa tin tức (Admin)

### News Details
- `GET /api/news-details/:newsId` - Lấy chi tiết tin tức theo tin tức ID
- `GET /api/news-details/detail/:id` - Lấy chi tiết tin tức theo ID
- `POST /api/news-details` - Tạo chi tiết tin tức (Admin)
- `PUT /api/news-details/:id` - Cập nhật chi tiết tin tức (Admin)
- `DELETE /api/news-details/:id` - Xóa chi tiết tin tức (Admin)

### Stores
- `GET /api/stores` - Lấy tất cả cửa hàng
- `GET /api/stores/search` - Tìm kiếm cửa hàng theo địa chỉ
- `GET /api/stores/:id` - Lấy cửa hàng theo ID
- `POST /api/stores` - Tạo cửa hàng (Admin)
- `PUT /api/stores/:id` - Cập nhật cửa hàng (Admin)
- `DELETE /api/stores/:id` - Xóa cửa hàng (Admin)

## Cài đặt

1. Clone repository
2. Cài đặt dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Tạo file `.env` từ `env.example`:
   ```bash
   cp env.example .env
   ```

4. Cấu hình environment variables trong file `.env`

5. Chạy server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SERVER=your_db_server
DB_PORT=1433
DB_DATABASE=your_database_name
DB_ENCRYPT=true

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h

# Session Configuration
SESSION_SECRET=your_session_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3001,http://localhost:5173

# Google Translate API
GOOGLE_API_KEY=your_google_api_key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
EMAIL_SERVICE=gmail

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Scripts

- `npm start` - Chạy server production
- `npm run dev` - Chạy server development với nodemon
- `npm test` - Chạy tests
- `npm run lint` - Kiểm tra code style
- `npm run lint:fix` - Tự động fix code style

## Middleware

### Authentication
- `auth` - Xác thực JWT token
- `adminAuth` - Xác thực admin role

### Validation
- `validateUser` - Validate user registration
- `validateLogin` - Validate login
- `validateProduct` - Validate product data
- `validateOrder` - Validate order data

### Error Handling
- `errorHandler` - Centralized error handling
- `notFound` - 404 handler

## Models

- `User` - Quản lý người dùng
- `Product` - Quản lý sản phẩm
- `Order` - Quản lý đơn hàng

## Controllers

- `AuthController` - Xử lý authentication
- `ProductController` - Xử lý sản phẩm
- `OrderController` - Xử lý đơn hàng

## Security

- Helmet.js cho security headers
- CORS configuration
- Input validation với express-validator
- JWT authentication
- Password hashing với bcrypt
- SQL injection prevention với parameterized queries

## Logging

Sử dụng Winston logger với:
- File logging cho production
- Console logging cho development
- Error tracking
- Request logging

## Database

- SQL Server với mssql driver
- Connection pooling
- Parameterized queries
- Transaction support

## Internationalization

- Google Translate API integration
- Dynamic language switching
- Fallback to original text on translation errors 
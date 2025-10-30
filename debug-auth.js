// Debug script để kiểm tra thông tin user và token
console.log('=== DEBUG AUTHENTICATION ===');

// Kiểm tra user trong localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('User from localStorage:', user);
console.log('User role:', user.VaiTro);
console.log('User ID:', user.MaNguoiDung);
console.log('User name:', user.TenNguoiDung);

// Kiểm tra token trong localStorage
const token = localStorage.getItem('token');
console.log('Token from localStorage:', token ? 'Present' : 'Missing');

// Kiểm tra cấu trúc user object
console.log('User object keys:', Object.keys(user));

// Kiểm tra xem có phải là Admin không
if (user.VaiTro === 'Admin') {
    console.log('✅ User is Admin');
} else {
    console.log('❌ User is not Admin. Role:', user.VaiTro);
}

// Kiểm tra token format
if (token) {
    try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('Token payload:', payload);
            console.log('Token role:', payload.VaiTro);
        }
    } catch (error) {
        console.log('Error parsing token:', error);
    }
}

console.log('=== END DEBUG ==='); 
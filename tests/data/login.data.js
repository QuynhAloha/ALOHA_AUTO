/**
 * Dữ liệu test riêng cho trang Login (tests/auth/login.spec.js).
 *
 * File này chỉ chứa DỮ LIỆU, không chứa hành động và không import gì từ
 * Playwright -> đọc là biết ngay test login chạy với những bộ dữ liệu nào.
 * Đặt trong tests/data/ nên Playwright không coi là file test.
 */

// Tài khoản hợp lệ của OrangeHRM demo
export const TAI_KHOAN_ADMIN = {
    username: 'Admin',
    password: 'admin123',
};

// Sai mật khẩu -> OrangeHRM báo "Invalid credentials"
export const TAI_KHOAN_SAI_MAT_KHAU = {
    username: 'Admin',
    password: 'sai_mat_khau_123',
};

// Bỏ trống cả 2 ô -> mỗi ô báo "Required"
export const TAI_KHOAN_TRONG = {
    username: '',
    password: '',
};

// Số ô báo "Required" khi submit form login trống (username + password)
export const SO_TRUONG_BAT_BUOC_LOGIN = 2;

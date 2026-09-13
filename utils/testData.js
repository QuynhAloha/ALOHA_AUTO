/**
 * Tiện ích và cấu hình dùng CHUNG cho mọi test.
 *
 * Dữ liệu riêng của từng page nằm ở tests/data/<page>.data.js
 * (login.data.js, dashboard.data.js, admin.data.js, candidates.data.js,
 * vacancies.data.js).
 */

/**
 * Sinh mã duy nhất cho dữ liệu test.
 *
 * OrangeHRM demo là môi trường dùng chung nên dữ liệu phải unique.
 * Thêm 3 số ngẫu nhiên vì các test chạy song song có thể gọi Date.now()
 * trong cùng 1 mili-giây -> trùng tên -> search ra nhầm bản ghi.
 */
export function dauThoiGian() {
    return `${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
}

/**
 * File lưu phiên đăng nhập Admin (cookie) do tests/setup/auth.setup.js tạo ra.
 * Mọi test (trừ test login và e2e) nạp file này để vào thẳng trang cần test
 * mà không phải đăng nhập lại. Đã có trong .gitignore.
 */
export const FILE_PHIEN_ADMIN = 'playwright/.auth/admin.json';

// Phiên trống: dùng cho test cần bắt đầu từ trạng thái CHƯA đăng nhập
export const PHIEN_TRONG = { cookies: [], origins: [] };

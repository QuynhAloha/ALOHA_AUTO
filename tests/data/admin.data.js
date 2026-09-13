/**
 * Dữ liệu test riêng cho trang Admin > User Management
 * (tests/admin/users.spec.js).
 *
 * Username và Employee Name KHÔNG đặt ở đây: OrangeHRM demo là môi trường
 * dùng chung, user bị thêm/xoá liên tục nên test lấy giá trị đang thực sự
 * có trong bảng làm từ khoá search.
 */

// 2 vai trò của OrangeHRM, dùng cho bộ lọc "User Role"
export const VAI_TRO_ADMIN = 'Admin';
export const VAI_TRO_ESS = 'ESS';

// Vai trò dùng để test bộ lọc (ESS chiếm phần lớn user trên demo)
export const VAI_TRO_CAN_SEARCH = VAI_TRO_ESS;

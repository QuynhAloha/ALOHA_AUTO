/**
 * Sinh dữ liệu test duy nhất để các lần chạy không đụng nhau
 * (OrangeHRM demo là môi trường dùng chung).
 */
function dauThoiGian() {
    // Thêm 3 số ngẫu nhiên: các test chạy song song có thể gọi Date.now()
    // trong cùng 1 mili-giây -> trùng tên -> search ra nhầm bản ghi.
    return `${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
}

export function taoDuLieuUngVien() {
    const id = dauThoiGian();
    return {
        firstName: 'AutoQA',
        lastName: `Cand${id}`,
        email: `autoqa.cand.${id}@example.com`,
        contactNumber: '0900000000',
        keywords: 'automation, playwright',
        get hoTen() {
            return `${this.firstName} ${this.lastName}`;
        },
    };
}

export function taoDuLieuVacancy() {
    const id = dauThoiGian();
    return {
        vacancyName: `AUTO_QA_Vacancy_${id}`,
        jobTitle: 'QA Engineer',
        description: 'Vacancy được tạo tự động bởi Playwright',
        hiringManagerHint: 'a',
        numberOfPositions: 2,
    };
}

/**
 * File lưu phiên đăng nhập Admin (cookie) do tests/setup/auth.setup.js tạo ra.
 * Mọi test (trừ test login và e2e) nạp file này để vào thẳng trang cần test
 * mà không phải đăng nhập lại. Đã có trong .gitignore.
 */
export const FILE_PHIEN_ADMIN = 'playwright/.auth/admin.json';

// Phiên trống: dùng cho test cần bắt đầu từ trạng thái CHƯA đăng nhập
export const PHIEN_TRONG = { cookies: [], origins: [] };

// ----- Menu trái -----

// Các module bắt buộc phải có trong menu trái sau khi đăng nhập
export const CAC_MODULE_MENU_TRAI = [
    'Admin',
    'PIM',
    'Leave',
    'Time',
    'Recruitment',
    'My Info',
    'Performance',
    'Dashboard',
    'Directory',
    'Maintenance',
];

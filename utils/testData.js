/**
 * Sinh dữ liệu test duy nhất để các lần chạy không đụng nhau
 * (OrangeHRM demo là môi trường dùng chung).
 */
function dauThoiGian() {
    return Date.now();
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

export const TAI_KHOAN_ADMIN = {
    username: 'Admin',
    password: 'admin123',
};

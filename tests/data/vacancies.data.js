/**
 * Dữ liệu test riêng cho tab Vacancies
 * (tests/recruitment/vacancies.spec.js).
 */
import { dauThoiGian } from '../../utils/testData.js';

// Số ô báo "Required" khi Save form Add Vacancy trống
// (Vacancy Name + Job Title + Hiring Manager)
export const SO_TRUONG_BAT_BUOC_VACANCY = 3;

// Các trường bắt buộc của form Add Vacancy (theo nhãn hiển thị)
export const CAC_TRUONG_BAT_BUOC_VACANCY = ['Vacancy Name', 'Job Title', 'Hiring Manager'];

/**
 * Sinh dữ liệu vacancy duy nhất để các lần chạy không đụng nhau.
 */
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

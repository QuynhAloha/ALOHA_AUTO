/**
 * Dữ liệu test riêng cho tab Candidates
 * (tests/recruitment/candidates.spec.js).
 */
import { dauThoiGian } from '../../utils/testData.js';

// Số ô báo "Required" khi Save form Add Candidate trống
// (First Name + Last Name + Email)
export const SO_TRUONG_BAT_BUOC_CANDIDATE = 3;

/**
 * Sinh dữ liệu ứng viên duy nhất để các lần chạy không đụng nhau.
 */
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

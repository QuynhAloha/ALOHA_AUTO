import { test } from '@playwright/test';

import { LoginPage } from '../../pages/LoginPage.js';
import { DashboardPage } from '../../pages/DashboardPage.js';
import { RecruitmentPage } from '../../pages/RecruitmentPage.js';
import { VacancyPage } from '../../pages/VacancyPage.js';
import { AdminPage } from '../../pages/AdminPage.js';
import { taoDuLieuUngVien, taoDuLieuVacancy, PHIEN_TRONG } from '../../utils/testData.js';
import { TAI_KHOAN_ADMIN } from '../data/login.data.js';
import { dungLai } from '../../utils/quanSat.js';

/**
 * E2E: đi xuyên nhiều module như người dùng thật, bắt đầu từ trang login.
 * -> KHÔNG dùng phiên đăng nhập lưu sẵn, phải tự đăng nhập ở bước 1.
 *
 * Từng tính năng đã được test riêng, kỹ hơn, trong tests/auth, tests/admin,
 * tests/recruitment. File này chỉ giữ vai trò smoke test: cả luồng còn chạy thông.
 */
test.use({ storageState: PHIEN_TRONG });

test.describe('E2E - Recruitment (Candidate + Vacancy) -> Admin', () => {

    let loginPage;
    let dashboardPage;
    let recruitmentPage;
    let vacancyPage;
    let adminPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        recruitmentPage = new RecruitmentPage(page);
        vacancyPage = new VacancyPage(page);
        adminPage = new AdminPage(page);
    });

    test('Full flow: Login -> Recruitment (Candidate + Vacancy) -> Admin search Employee Name', async ({ page }) => {
        const ungVien = taoDuLieuUngVien();
        const vacancy = taoDuLieuVacancy();

        let soDongSauKhiSearchUngVien;
        let soDongSauKhiSearchVacancy;
        let soDongSauKhiSearchNhanVien;

        await test.step('1. Đăng nhập thành công, vào Dashboard (dừng 4s)', async () => {
            await loginPage.moTrangWeb();
            await loginPage.dangNhap(TAI_KHOAN_ADMIN.username, TAI_KHOAN_ADMIN.password);
            await loginPage.kiemTraDangNhapThanhCong();
            await dashboardPage.kiemTraDangOTrangDashboard();

            await dungLai(page, 4);
        });

        await test.step('2. Vào Recruitment, mặc định ở tab Candidates (dừng 3s)', async () => {
            await dashboardPage.bamVaoMenuRecruitment();
            await recruitmentPage.kiemTraDangOTrangCandidates();
            await recruitmentPage.kiemTraTabDangChon('Candidates');

            await dungLai(page, 3);
        });

        await test.step('3. Tạo Candidate mới thành công (dừng 4s)', async () => {
            await recruitmentPage.moFormThemUngVien();
            await recruitmentPage.themUngVien(ungVien);

            await dungLai(page, 4);
        });

        await test.step('4. Quay lại trang danh sách Candidates (dừng 3s)', async () => {
            await recruitmentPage.quayLaiDanhSachUngVien();

            await dungLai(page, 3);
        });

        await test.step('5. Search ứng viên vừa tạo, kết quả hiển thị đúng (dừng 4s)', async () => {
            await recruitmentPage.timUngVienTheoTuKhoa(ungVien.lastName);
            await recruitmentPage.kiemTraUngVienCoTrongDanhSach(ungVien.hoTen);
            soDongSauKhiSearchUngVien = await recruitmentPage.dongKetQua().count();

            await dungLai(page, 4);
        });

        await test.step('6. Reset bộ lọc Candidates, danh sách trở về đầy đủ (dừng 3s)', async () => {
            await recruitmentPage.bamNutReset();
            await recruitmentPage.kiemTraDaResetBoLoc();
            await recruitmentPage.kiemTraDanhSachTroVeDayDu(soDongSauKhiSearchUngVien);

            await dungLai(page, 3);
        });

        await test.step('7. Chuyển sang tab Vacancies', async () => {
            await recruitmentPage.chuyenSangTabVacancies();
            await recruitmentPage.kiemTraTabDangChon('Vacancies');
            await vacancyPage.kiemTraDangOTrangVacancies();

            await dungLai(page, 3);
        });

        await test.step('8. Tạo Vacancy mới thành công (dừng 4s)', async () => {
            await vacancyPage.moFormThemVacancy();
            await vacancyPage.themVacancy(vacancy);

            await dungLai(page, 4);
        });

        await test.step('9. Quay lại danh sách, search Vacancy vừa tạo (dừng 4s)', async () => {
            await vacancyPage.quayLaiDanhSachVacancy();
            await vacancyPage.timVacancyTheoTen(vacancy.vacancyName);
            await vacancyPage.kiemTraVacancyCoTrongDanhSach(vacancy.vacancyName);
            soDongSauKhiSearchVacancy = await vacancyPage.dongKetQua().count();

            await dungLai(page, 4);
        });

        await test.step('10. Reset bộ lọc Vacancies, danh sách trở về đầy đủ (dừng 3s)', async () => {
            await vacancyPage.bamNutReset();
            await vacancyPage.kiemTraDaResetBoLoc();
            await vacancyPage.kiemTraDanhSachTroVeDayDu(soDongSauKhiSearchVacancy);

            await dungLai(page, 3);
        });

        await test.step('11. Từ Recruitment sang module Admin (dừng 3s)', async () => {
            await dashboardPage.bamVaoMenuAdmin();
            await adminPage.kiemTraDangOTrangAdmin();

            await dungLai(page, 3);
        });

        await test.step('12. Search theo "Employee Name", kết quả đúng nhân viên (dừng 4s)', async () => {
            // Lấy tên đang có sẵn trong bảng làm từ khoá -> luôn ra kết quả
            const tenNhanVien = await adminPage.layTenNhanVienDongDauTien();
            const tenDaChon = await adminPage.timTheoTenNhanVien(tenNhanVien);

            soDongSauKhiSearchNhanVien = await adminPage.kiemTraKetQuaDungTenNhanVien(tenDaChon);

            await dungLai(page, 4);
        });

        await test.step('13. Reset bộ lọc Admin, danh sách trở về đầy đủ (dừng 3s)', async () => {
            await adminPage.bamNutReset();
            await adminPage.kiemTraDaResetBoLoc();
            await adminPage.kiemTraDanhSachTroVeDayDu(soDongSauKhiSearchNhanVien);

            await dungLai(page, 3);
        });
    });
});

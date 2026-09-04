import { test } from '@playwright/test';

import { LoginPage } from '../../pages/LoginPage.js';
import { DashboardPage } from '../../pages/DashboardPage.js';
import { RecruitmentPage } from '../../pages/RecruitmentPage.js';
import { VacancyPage } from '../../pages/VacancyPage.js';
import { taoDuLieuUngVien, taoDuLieuVacancy, TAI_KHOAN_ADMIN } from '../../utils/testData.js';
import { dungLai } from '../../utils/quanSat.js';

test.describe('Recruitment - Candidates & Vacancies', () => {

    let loginPage;
    let dashboardPage;
    let recruitmentPage;
    let vacancyPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        recruitmentPage = new RecruitmentPage(page);
        vacancyPage = new VacancyPage(page);
    });

    test('Full flow: Login -> Recruitment -> tạo Candidate -> tab Vacancies -> tạo Vacancy', async ({ page }) => {
        const ungVien = taoDuLieuUngVien();
        const vacancy = taoDuLieuVacancy();

        let soDongSauKhiSearchUngVien;
        let soDongSauKhiSearchVacancy;

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
    });
});

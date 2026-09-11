import { test, expect } from '@playwright/test';

import { VacancyPage } from '../../pages/VacancyPage.js';
import { taoDuLieuVacancy } from '../../utils/testData.js';
import { dungLai } from '../../utils/quanSat.js';

/**
 * Recruitment > tab Vacancies.
 * Dùng phiên đăng nhập lưu sẵn -> mở thẳng tab Vacancies.
 * Mỗi test tự tạo dữ liệu riêng (tên unique), không phụ thuộc test khác.
 */
test.describe('Recruitment - Vacancies', () => {

    let vacancyPage;

    test.beforeEach(async ({ page }) => {
        vacancyPage = new VacancyPage(page);
        await vacancyPage.moTrangVacancies();
    });

    test('Tạo Vacancy mới thành công', async ({ page }) => {
        const vacancy = taoDuLieuVacancy();

        await vacancyPage.moFormThemVacancy();
        // themVacancy đã tự chờ chuyển sang trang chi tiết /addJobVacancy/<id>
        await vacancyPage.themVacancy(vacancy);

        await dungLai(page, 3);
    });

    test('Search Vacancy vừa tạo -> đúng kết quả; Reset -> danh sách đầy đủ', async ({ page }) => {
        const vacancy = taoDuLieuVacancy();
        let soDongSauKhiSearch;

        await test.step('Chuẩn bị: tạo 1 Vacancy mới để search', async () => {
            await vacancyPage.moFormThemVacancy();
            await vacancyPage.themVacancy(vacancy);
            await vacancyPage.quayLaiDanhSachVacancy();
        });

        await test.step('Search theo tên Vacancy -> thấy đúng vacancy', async () => {
            await vacancyPage.timVacancyTheoTen(vacancy.vacancyName);
            await vacancyPage.kiemTraVacancyCoTrongDanhSach(vacancy.vacancyName);
            soDongSauKhiSearch = await vacancyPage.dongKetQua().count();

            await dungLai(page, 3);
        });

        await test.step('Reset -> dropdown về "-- Select --", danh sách đầy đủ', async () => {
            await vacancyPage.bamNutReset();
            await vacancyPage.kiemTraDaResetBoLoc();
            await vacancyPage.kiemTraDanhSachTroVeDayDu(soDongSauKhiSearch);

            await dungLai(page, 2);
        });
    });

    test('Bỏ trống trường bắt buộc -> 3 ô báo "Required", không lưu', async ({ page }) => {
        await vacancyPage.moFormThemVacancy();
        await vacancyPage.bamNutLuu();

        await vacancyPage.kiemTraBaoLoiBatBuoc(3);
        await vacancyPage.kiemTraTruongBaoBatBuoc('Vacancy Name');
        await vacancyPage.kiemTraTruongBaoBatBuoc('Job Title');
        await vacancyPage.kiemTraTruongBaoBatBuoc('Hiring Manager');
        await expect(page).toHaveURL(/recruitment\/addJobVacancy$/);

        await dungLai(page, 3);
    });
});

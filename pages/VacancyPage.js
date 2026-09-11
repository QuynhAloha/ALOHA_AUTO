import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * VacancyPage: thao tác trên tab Vacancies của module Recruitment.
 */
export class VacancyPage extends BasePage {

    // Mở thẳng tab Vacancies (cần phiên đăng nhập sẵn)
    async moTrangVacancies() {
        await this.moTrang('recruitment/viewJobVacancy');
        await this.kiemTraDangOTrangVacancies();
        await expect(this.bangKetQua()).toBeVisible({ timeout: 15000 });
    }

    async kiemTraDangOTrangVacancies() {
        await expect(this.page).toHaveURL(/viewJobVacancy/);
        await expect(
            this.page.getByRole('heading', { name: 'Vacancies' })
        ).toBeVisible();
    }

    async moFormThemVacancy() {
        await this.page.getByRole('button', { name: 'Add' }).click();
        await this.page.waitForURL('**/recruitment/addJobVacancy');
        await expect(
            this.page.getByRole('heading', { name: 'Add Vacancy' })
        ).toBeVisible();
    }

    /**
     * Điền form Add Vacancy và bấm Save.
     * Bắt buộc: vacancyName, jobTitle, hiringManager (ô gợi ý).
     * Trả về tên Hiring Manager thực tế đã chọn từ danh sách gợi ý.
     */
    async themVacancy(duLieu) {
        await this.dienTheoNhan('Vacancy Name', duLieu.vacancyName);
        await this.chonDropdownTheoNhan('Job Title', duLieu.jobTitle);

        if (duLieu.description) {
            await this.dienTheoNhan('Description', duLieu.description);
        }

        const hiringManager = await this.chonGoiYTheoNhan('Hiring Manager', duLieu.hiringManagerHint);

        if (duLieu.numberOfPositions) {
            await this.dienTheoNhan('Number of Positions', String(duLieu.numberOfPositions));
        }

        await this.bamNutLuu();

        // Lưu thành công -> chuyển sang trang chi tiết vacancy vừa tạo
        await this.doiLuuThanhCong(/recruitment\/addJobVacancy\/\d+/);

        return hiringManager;
    }

    // Quay lại danh sách Vacancies (sau khi vừa tạo xong vacancy)
    async quayLaiDanhSachVacancy() {
        await this.page.getByRole('link', { name: 'Vacancies', exact: true }).click();
        await this.page.waitForURL('**/recruitment/viewJobVacancy');
        await expect(this.bangKetQua()).toBeVisible({ timeout: 15000 });
    }

    // Tìm vacancy bằng bộ lọc 'Vacancy' trên danh sách
    async timVacancyTheoTen(tenVacancy) {
        await this.chonDropdownTheoNhan('Vacancy', tenVacancy);
        await this.bamNutSearch();
    }

    // Sau khi Reset, dropdown lọc "Vacancy" phải quay về '-- Select --'
    async kiemTraDaResetBoLoc() {
        await expect(
            this.nhomTruong('Vacancy').locator('.oxd-select-text-input')
        ).toHaveText('-- Select --');
    }

    async kiemTraVacancyCoTrongDanhSach(tenVacancy) {
        await expect(this.bangKetQua()).toContainText(tenVacancy);
    }
}

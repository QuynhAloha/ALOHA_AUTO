import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { dungLai } from '../utils/quanSat.js';

/**
 * RecruitmentPage: quản lý 2 tab của module Recruitment (Candidates / Vacancies)
 * và toàn bộ thao tác trên tab Candidates.
 */
export class RecruitmentPage extends BasePage {

    // ----- Tabs -----

    tab(tenTab) {
        return this.page.getByRole('link', { name: tenTab, exact: true });
    }

    // Tab đang được highlight có class '--visited' trên thẻ <li>
    tabDangChon() {
        return this.page.locator('.oxd-topbar-body-nav-tab.--visited');
    }

    async kiemTraTabDangChon(tenTab) {
        await expect(this.tabDangChon()).toHaveText(tenTab);
    }

    async chuyenSangTabCandidates() {
        await this.tab('Candidates').click();
        await this.page.waitForURL('**/recruitment/viewCandidates');
    }

    async chuyenSangTabVacancies() {
        await this.tab('Vacancies').click();
        await this.page.waitForURL('**/recruitment/viewJobVacancy');
    }

    // ----- Danh sách Candidates -----

    // Mở thẳng tab Candidates (cần phiên đăng nhập sẵn)
    async moTrangCandidates() {
        await this.moTrang('recruitment/viewCandidates');
        await this.kiemTraDangOTrangCandidates();
        await expect(this.bangKetQua()).toBeVisible({ timeout: 15000 });
    }

    async kiemTraDangOTrangCandidates() {
        await expect(this.page).toHaveURL(/viewCandidates/);
        await expect(
            this.page.locator('.oxd-topbar-header-breadcrumb-module')
        ).toHaveText('Recruitment');
    }

    async bamNutAdd() {
        await this.page.getByRole('button', { name: 'Add' }).click();
    }

    // ----- Form Add Candidate -----

    async moFormThemUngVien() {
        await this.bamNutAdd();
        await this.page.waitForURL('**/recruitment/addCandidate');
        await expect(
            this.page.getByRole('heading', { name: 'Add Candidate' })
        ).toBeVisible();
    }

    /**
     * Điền form Add Candidate và bấm Save.
     * Bắt buộc: firstName, lastName, email. Các trường khác là tuỳ chọn.
     * Ở chế độ quan sát, mỗi ô được gõ từng ký tự rồi dừng 1 nhịp.
     */
    async themUngVien(duLieu) {
        await this.goCham(this.page.locator('input[name="firstName"]'), duLieu.firstName);

        if (duLieu.middleName) {
            await this.goCham(this.page.locator('input[name="middleName"]'), duLieu.middleName);
        }

        await this.goCham(this.page.locator('input[name="lastName"]'), duLieu.lastName);
        await this.goChamTheoNhan('Email', duLieu.email);

        if (duLieu.contactNumber) {
            await this.goChamTheoNhan('Contact Number', duLieu.contactNumber);
        }
        if (duLieu.keywords) {
            await this.goChamTheoNhan('Keywords', duLieu.keywords);
        }
        if (duLieu.notes) {
            await this.goChamTheoNhan('Notes', duLieu.notes);
        }

        // Dừng để nhìn lại toàn bộ thông tin trước khi bấm Save
        await dungLai(this.page, 2);

        await this.bamNutLuu();

        // Lưu thành công -> chuyển sang trang hồ sơ ứng viên vừa tạo
        await this.doiLuuThanhCong(/recruitment\/addCandidate\/\d+/);
    }

    /**
     * Quay lại trang danh sách Candidates (sau khi vừa tạo xong ứng viên).
     */
    async quayLaiDanhSachUngVien() {
        await this.chuyenSangTabCandidates();
        await this.kiemTraDangOTrangCandidates();
        await expect(this.bangKetQua()).toBeVisible({ timeout: 15000 });
    }

    /**
     * Search ứng viên trên danh sách Candidates.
     * Bộ lọc "Candidate Name" của OrangeHRM chỉ khớp theo TỪNG TỪ trong tên,
     * gõ cả "First Last" sẽ ra "No Records Found" -> truyền vào 1 từ khoá duy nhất
     * (ví dụ lastName) là ổn định nhất.
     */
    async timUngVienTheoTuKhoa(tuKhoa) {
        await this.chonGoiYTheoNhan('Candidate Name', tuKhoa);
        await dungLai(this.page, 1);

        await this.bamNutSearch();
    }

    // Sau khi Reset, ô lọc "Candidate Name" phải trắng
    async kiemTraDaResetBoLoc() {
        await expect(
            this.nhomTruong('Candidate Name').locator('input')
        ).toHaveValue('');
    }

    async kiemTraUngVienCoTrongDanhSach(hoTen) {
        await expect(this.bangKetQua()).toContainText(hoTen);
    }
}

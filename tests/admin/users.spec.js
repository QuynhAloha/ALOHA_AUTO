import { test } from '@playwright/test';

import { AdminPage } from '../../pages/AdminPage.js';
import { VAI_TRO_CAN_SEARCH } from '../data/admin.data.js';
import { dungLai } from '../../utils/quanSat.js';

/**
 * Admin > User Management > Users.
 * Dùng phiên đăng nhập lưu sẵn (project 'setup') -> mở thẳng trang Admin.
 */
test.describe('Admin - User Management', () => {

    let adminPage;

    test.beforeEach(async ({ page }) => {
        adminPage = new AdminPage(page);
        await adminPage.moTrangAdmin();
    });

    test('Search theo Employee Name -> mọi dòng đúng nhân viên đó', async ({ page }) => {
        // Lấy tên đang có sẵn trong bảng làm từ khoá -> luôn ra kết quả
        const tenNhanVien = await adminPage.layTenNhanVienDongDauTien();
        const tenDaChon = await adminPage.timTheoTenNhanVien(tenNhanVien);

        await adminPage.kiemTraKetQuaDungTenNhanVien(tenDaChon);

        await dungLai(page, 3);
    });

    test('Search theo Username -> ra đúng user đó', async ({ page }) => {
        const username = await adminPage.layUsernameDongDauTien();
        await adminPage.timTheoUsername(username);

        await adminPage.kiemTraKetQuaDungUsername(username);

        await dungLai(page, 3);
    });

    test('Search theo User Role "ESS" -> mọi dòng đều là ESS', async ({ page }) => {
        await adminPage.timTheoUserRole(VAI_TRO_CAN_SEARCH);

        await adminPage.kiemTraKetQuaDungUserRole(VAI_TRO_CAN_SEARCH);

        await dungLai(page, 3);
    });

    test('Reset sau khi search -> bộ lọc trắng, danh sách trở về đầy đủ', async ({ page }) => {
        const username = await adminPage.layUsernameDongDauTien();
        await adminPage.timTheoUsername(username);
        const soDongSauKhiSearch = await adminPage.kiemTraKetQuaDungUsername(username);
        await dungLai(page, 2);

        await adminPage.bamNutReset();

        await adminPage.kiemTraDaResetBoLoc();
        await adminPage.kiemTraDanhSachTroVeDayDu(soDongSauKhiSearch);

        await dungLai(page, 2);
    });

    test('Bấm Add -> mở form Add User', async ({ page }) => {
        await adminPage.bamNutAddUser();

        await dungLai(page, 3);
    });
});

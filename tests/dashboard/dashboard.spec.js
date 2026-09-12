import { test } from '@playwright/test';

import { DashboardPage } from '../../pages/DashboardPage.js';
import { AdminPage } from '../../pages/AdminPage.js';
import { RecruitmentPage } from '../../pages/RecruitmentPage.js';
import { CAC_MODULE_MENU_TRAI } from '../../utils/testData.js';
import { dungLai } from '../../utils/quanSat.js';

/**
 * Dashboard: trang đích sau khi đăng nhập và là nơi điều hướng sang mọi module.
 * Dùng phiên đăng nhập lưu sẵn -> mở thẳng Dashboard.
 */
test.describe('Dashboard', () => {

    let dashboardPage;
    let adminPage;
    let recruitmentPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        adminPage = new AdminPage(page);
        recruitmentPage = new RecruitmentPage(page);

        await dashboardPage.moTrangDashboard();
    });

    test('Mở Dashboard -> breadcrumb hiển thị "Dashboard"', async ({ page }) => {
        await dashboardPage.kiemTraDangOTrangDashboard();

        await dungLai(page, 2);
    });

    test('Menu trái hiển thị đủ các module chính', async ({ page }) => {
        await dashboardPage.kiemTraMenuTraiCoDuModule(CAC_MODULE_MENU_TRAI);

        await dungLai(page, 2);
    });

    test('Từ Dashboard vào module Admin qua menu trái', async ({ page }) => {
        await dashboardPage.bamVaoMenuAdmin();
        await adminPage.kiemTraDangOTrangAdmin();

        await dungLai(page, 2);
    });

    test('Từ Dashboard vào module Recruitment qua menu trái', async ({ page }) => {
        await dashboardPage.bamVaoMenuRecruitment();
        await recruitmentPage.kiemTraDangOTrangCandidates();

        await dungLai(page, 2);
    });
});

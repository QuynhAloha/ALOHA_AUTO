import { test as setup } from '@playwright/test';

import { LoginPage } from '../../pages/LoginPage.js';
import { DashboardPage } from '../../pages/DashboardPage.js';
import { TAI_KHOAN_ADMIN } from '../data/login.data.js';
import { FILE_PHIEN_ADMIN } from '../../utils/testData.js';

/**
 * Chạy 1 lần duy nhất ở đầu mỗi lần `playwright test` (project 'setup').
 * Đăng nhập Admin qua UI rồi lưu cookie ra FILE_PHIEN_ADMIN.
 * Mọi test sau đó nạp lại phiên này -> không phải login lại từng test.
 */
setup('Đăng nhập Admin 1 lần, lưu phiên cho các test dùng lại', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.moTrangWeb();
    await loginPage.dangNhap(TAI_KHOAN_ADMIN.username, TAI_KHOAN_ADMIN.password);
    await loginPage.kiemTraDangNhapThanhCong();
    await dashboardPage.kiemTraDangOTrangDashboard();

    await page.context().storageState({ path: FILE_PHIEN_ADMIN });
});

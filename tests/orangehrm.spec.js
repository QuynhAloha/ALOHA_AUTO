import { test } from '@playwright/test';

// Import Page Objects
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { AdminPage } from '../pages/AdminPage.js';
import { TAI_KHOAN_ADMIN } from '../utils/testData.js';

test('Test case 5: POM flow - Login and open Add User form', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const adminPage = new AdminPage(page);

    // Step 1: Login
    await loginPage.moTrangWeb();
    await loginPage.dangNhap(TAI_KHOAN_ADMIN.username, TAI_KHOAN_ADMIN.password);
    await loginPage.kiemTraDangNhapThanhCong();

    // Step 2: Open Admin menu
    await dashboardPage.bamVaoMenuAdmin();
    await adminPage.kiemTraDangOTrangAdmin();

    // Step 3: Open Add User form
    await adminPage.bamNutAddUser();
});

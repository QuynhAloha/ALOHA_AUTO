import { test } from '@playwright/test';

import { LoginPage } from '../../pages/LoginPage.js';
import { DashboardPage } from '../../pages/DashboardPage.js';
import { TAI_KHOAN_ADMIN, PHIEN_TRONG } from '../../utils/testData.js';
import { dungLai } from '../../utils/quanSat.js';

// File này test chính việc đăng nhập -> KHÔNG dùng phiên lưu sẵn
test.use({ storageState: PHIEN_TRONG });

test.describe('Login', () => {

    let loginPage;
    let dashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);

        await loginPage.moTrangWeb();
    });

    test('Đăng nhập đúng tài khoản -> vào Dashboard', async ({ page }) => {
        await loginPage.dangNhap(TAI_KHOAN_ADMIN.username, TAI_KHOAN_ADMIN.password);

        await loginPage.kiemTraDangNhapThanhCong();
        await dashboardPage.kiemTraDangOTrangDashboard();

        await dungLai(page, 2);
    });

    test('Sai mật khẩu -> báo "Invalid credentials", vẫn ở trang login', async ({ page }) => {
        await loginPage.dangNhap(TAI_KHOAN_ADMIN.username, 'sai_mat_khau');

        await loginPage.kiemTraThongBaoSaiThongTin();

        await dungLai(page, 2);
    });

    test('Bỏ trống username và password -> 2 ô báo "Required"', async ({ page }) => {
        await loginPage.dangNhap('', '');

        await loginPage.kiemTraBaoLoiBatBuoc(2);
        await loginPage.kiemTraDangOTrangLogin();

        await dungLai(page, 2);
    });

    test('Đăng xuất -> quay về trang login', async ({ page }) => {
        await loginPage.dangNhap(TAI_KHOAN_ADMIN.username, TAI_KHOAN_ADMIN.password);
        await loginPage.kiemTraDangNhapThanhCong();
        await dungLai(page, 2);

        // Test này tự đăng nhập bằng phiên riêng, nên đăng xuất ở đây
        // KHÔNG làm hỏng phiên dùng chung của các test khác.
        await dashboardPage.dangXuat();
        await loginPage.kiemTraDangOTrangLogin();

        await dungLai(page, 2);
    });
});

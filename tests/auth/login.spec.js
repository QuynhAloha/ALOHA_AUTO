import { test } from '@playwright/test';

import { LoginPage } from '../../pages/LoginPage.js';
import { DashboardPage } from '../../pages/DashboardPage.js';
import {
    TAI_KHOAN_ADMIN,
    TAI_KHOAN_SAI_MAT_KHAU,
    TAI_KHOAN_TRONG,
    SO_TRUONG_BAT_BUOC_LOGIN,
} from '../data/login.data.js';
import { PHIEN_TRONG } from '../../utils/testData.js';
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
        await loginPage.dangNhap(TAI_KHOAN_SAI_MAT_KHAU.username, TAI_KHOAN_SAI_MAT_KHAU.password);

        await loginPage.kiemTraThongBaoSaiThongTin();

        await dungLai(page, 2);
    });

    test('Bỏ trống username và password -> 2 ô báo "Required"', async ({ page }) => {
        await loginPage.dangNhap(TAI_KHOAN_TRONG.username, TAI_KHOAN_TRONG.password);

        await loginPage.kiemTraBaoLoiBatBuoc(SO_TRUONG_BAT_BUOC_LOGIN);
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

import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {

    // Hành động 1: Mở web
    async moTrangWeb() {
        /**
         * waitUntil mặc định của Playwright là 'load' -> chờ TẤT CẢ tài nguyên,
         * kể cả widget mạng xã hội của OrangeHRM. Chỉ cần 1 tài nguyên bên thứ ba
         * treo là goto timeout dù trang đã dùng được.
         * -> chỉ chờ DOM, rồi chờ đúng ô cần thao tác.
         */
        await this.page.goto('auth/login', { waitUntil: 'domcontentloaded' });
        await this.page.locator('input[name="username"]').waitFor({ state: 'visible' });
    }

    // Hành động 2: Thực hiện đăng nhập
    async dangNhap(username, password) {
        await this.page.fill('input[name="username"]', username);
        await this.page.fill('input[name="password"]', password);
        await this.page.click('button[type="submit"]');
    }

    // Hành động 3: Xác nhận đăng nhập thành công (đã vào Dashboard)
    async kiemTraDangNhapThanhCong() {
        await this.page.waitForURL('**/dashboard/index');
        await expect(
            this.page.locator('.oxd-topbar-header-breadcrumb-module')
        ).toHaveText('Dashboard');
    }

    // Đang đứng ở trang login (chưa đăng nhập / vừa đăng xuất)
    async kiemTraDangOTrangLogin() {
        await expect(this.page).toHaveURL(/auth\/login/);
        await expect(this.page.locator('input[name="username"]')).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Login' })).toBeVisible();
    }

    // Sai username/password -> hộp cảnh báo "Invalid credentials", vẫn ở trang login
    async kiemTraThongBaoSaiThongTin() {
        await expect(this.page.locator('.oxd-alert-content-text')).toHaveText('Invalid credentials');
        await this.kiemTraDangOTrangLogin();
    }
}

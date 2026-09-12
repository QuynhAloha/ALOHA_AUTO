import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class DashboardPage extends BasePage {

    // Menu bên trái: dùng chung cho mọi module (Admin, PIM, Recruitment...)
    menuTrai(tenModule) {
        return this.page.getByRole('link', { name: tenModule, exact: true });
    }

    // Mở thẳng Dashboard (cần phiên đăng nhập sẵn)
    async moTrangDashboard() {
        await this.moTrang('dashboard/index');
        await this.kiemTraDangOTrangDashboard();
    }

    async kiemTraDangOTrangDashboard() {
        await expect(
            this.page.locator('.oxd-topbar-header-breadcrumb-module')
        ).toHaveText('Dashboard');
    }

    // Menu trái phải có đủ các module chính
    async kiemTraMenuTraiCoDuModule(danhSachModule) {
        for (const tenModule of danhSachModule) {
            await expect(
                this.menuTrai(tenModule),
                `Menu trái phải có module "${tenModule}"`,
            ).toBeVisible();
        }
    }

    // Mở 1 module bất kỳ từ menu trái
    async bamVaoMenu(tenModule) {
        await this.menuTrai(tenModule).click();
    }

    async bamVaoMenuAdmin() {
        await this.bamVaoMenu('Admin');
        await this.page.waitForURL('**/admin/viewSystemUsers');
    }

    async bamVaoMenuRecruitment() {
        await this.bamVaoMenu('Recruitment');
        await this.page.waitForURL('**/recruitment/viewCandidates');
    }
}

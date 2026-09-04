import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class DashboardPage extends BasePage {

    // Menu bên trái: dùng chung cho mọi module (Admin, PIM, Recruitment...)
    menuTrai(tenModule) {
        return this.page.getByRole('link', { name: tenModule, exact: true });
    }

    async kiemTraDangOTrangDashboard() {
        await expect(
            this.page.locator('.oxd-topbar-header-breadcrumb-module')
        ).toHaveText('Dashboard');
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

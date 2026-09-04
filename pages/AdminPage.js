import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class AdminPage extends BasePage {

    // Kiểm tra đã vào đúng trang Admin chưa
    async kiemTraDangOTrangAdmin() {
        await expect(
            this.page.locator('.oxd-topbar-header-breadcrumb-module')
        ).toHaveText('Admin');
    }

    async bamNutAddUser() {
        await this.page.getByRole('button', { name: 'Add' }).click();
        await this.page.waitForURL('**/admin/saveSystemUser');
        await expect(this.page.getByRole('heading', { name: 'Add User' })).toBeVisible();
    }
}

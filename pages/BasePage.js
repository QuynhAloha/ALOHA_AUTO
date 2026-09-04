import { expect } from '@playwright/test';
import { CHE_DO_QUAN_SAT, DO_TRE_GO_PHIM, dungLai } from '../utils/quanSat.js';

/**
 * BasePage: chứa các hành động dùng chung cho mọi page của OrangeHRM.
 * Các form của OrangeHRM hầu hết KHÔNG có attribute name/id,
 * nên cách ổn định nhất là tìm ô nhập theo NHÃN (label) đứng cạnh nó.
 */
export class BasePage {

    constructor(page) {
        this.page = page;
    }

    // Lấy cả cụm "label + ô nhập" theo tên nhãn
    nhomTruong(nhan) {
        return this.page
            .locator('.oxd-input-group')
            .filter({ has: this.page.getByText(nhan, { exact: true }) })
            .last();
    }

    // Điền vào ô input/textarea nằm dưới nhãn
    async dienTheoNhan(nhan, giaTri) {
        await this.nhomTruong(nhan).locator('input, textarea').fill(String(giaTri));
    }

    /**
     * Gõ từng ký tự vào 1 ô nhập để quan sát được (chỉ khi CHE_DO_QUAN_SAT bật),
     * sau đó dừng lại 1 nhịp. Khi PAUSE=0 thì fill thẳng cho nhanh.
     */
    async goCham(oNhap, giaTri) {
        const noiDung = String(giaTri);

        if (!CHE_DO_QUAN_SAT) {
            await oNhap.fill(noiDung);
            return;
        }

        await oNhap.click();
        await oNhap.fill('');
        await oNhap.pressSequentially(noiDung, { delay: DO_TRE_GO_PHIM });
        await dungLai(this.page, 1);
    }

    // Gõ chậm vào ô nhập tìm theo nhãn
    async goChamTheoNhan(nhan, giaTri) {
        await this.goCham(this.nhomTruong(nhan).locator('input, textarea'), giaTri);
    }

    // Chọn giá trị trong dropdown (oxd-select) theo nhãn
    async chonDropdownTheoNhan(nhan, giaTri) {
        await this.nhomTruong(nhan).locator('.oxd-select-text').click();
        await this.page.getByRole('option', { name: giaTri, exact: true }).click();
    }

    /**
     * Chọn giá trị trong ô gợi ý (autocomplete) theo nhãn.
     * OrangeHRM hiện option tạm "Searching---" trong lúc gọi API,
     * nên phải đợi kết quả thật rồi mới click, nếu không ô sẽ báo "Invalid".
     * Trả về text thực tế đã chọn, vì dữ liệu nhân viên trên demo site có thể thay đổi.
     */
    async chonGoiYTheoNhan(nhan, tuKhoa) {
        const oNhap = this.nhomTruong(nhan).locator('input');
        await oNhap.fill(tuKhoa);

        const goiY = this.page.locator('.oxd-autocomplete-dropdown').getByRole('option').first();
        await expect(goiY).toBeVisible({ timeout: 15000 });
        await expect(goiY).not.toHaveText(/Searching/i, { timeout: 15000 });
        await expect(goiY).not.toHaveText(/No Records Found/i);

        const giaTriDaChon = (await goiY.innerText()).trim();
        await goiY.click();

        // Xác nhận giá trị đã thực sự được gán vào ô nhập.
        // Chuẩn hoá khoảng trắng vì OrangeHRM ghép first + middle + last name
        // nên khi thiếu middle name value sẽ có 2 dấu cách liền nhau.
        await expect
            .poll(async () => (await oNhap.inputValue()).replace(/\s+/g, ' ').trim())
            .toBe(giaTriDaChon);
        return giaTriDaChon;
    }

    // ----- Khối bộ lọc + bảng kết quả (giống nhau ở cả Candidates và Vacancies) -----

    bangKetQua() {
        return this.page.locator('.oxd-table-body');
    }

    // Mỗi dòng trong bảng kết quả
    dongKetQua() {
        return this.page.locator('.oxd-table-card');
    }

    async bamNutSearch() {
        await this.page.getByRole('button', { name: 'Search' }).click();
        await expect(this.bangKetQua()).toBeVisible({ timeout: 15000 });
    }

    /**
     * Bấm Reset: xoá trắng bộ lọc và load lại danh sách đầy đủ.
     */
    async bamNutReset() {
        await this.page.getByRole('button', { name: 'Reset' }).click();
        await expect(this.bangKetQua()).toBeVisible({ timeout: 15000 });
    }

    // Sau khi Reset, danh sách phải trở về nhiều bản ghi (không còn lọc 1 dòng)
    async kiemTraDanhSachTroVeDayDu(soDongTruocKhiReset) {
        await expect
            .poll(async () => await this.dongKetQua().count(), { timeout: 15000 })
            .toBeGreaterThan(soDongTruocKhiReset);
    }

    async bamNutLuu() {
        await this.page.getByRole('button', { name: 'Save' }).click();
    }

    /**
     * Chờ lưu xong: sau khi Save, OrangeHRM điều hướng sang trang chi tiết
     * của bản ghi vừa tạo (URL có kèm id). Đây là tín hiệu ổn định nhất,
     * vì toast "Successfully Saved" chỉ hiện ~3 giây rồi tự biến mất.
     */
    async doiLuuThanhCong(mauUrl) {
        await this.page.waitForURL(mauUrl, { timeout: 30 * 1000 });
    }

    // Kiểm tra toast "Successfully Saved" (chỉ dùng cho form không điều hướng sau khi lưu)
    async kiemTraLuuThanhCong() {
        const toast = this.page.locator('.oxd-toast');
        await expect(toast).toBeVisible({ timeout: 15000 });
        await expect(toast).toContainText('Success');
        // Đợi toast tự tắt để không che các thao tác tiếp theo
        await toast.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    }
}

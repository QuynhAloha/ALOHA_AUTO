import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * AdminPage: module Admin > User Management > Users.
 *
 * Bảng danh sách user có 6 ô mỗi dòng:
 *   [checkbox] | Username | User Role | Employee Name | Status | Actions
 */
const COT = {
    USERNAME: 1,
    USER_ROLE: 2,
    TEN_NHAN_VIEN: 3,
    STATUS: 4,
};

// Chuẩn hoá khoảng trắng: OrangeHRM hay để 2 dấu cách khi thiếu middle name
const chuanHoa = (text) => text.replace(/\s+/g, ' ').trim();

export class AdminPage extends BasePage {

    // ----- Điều hướng -----

    // Mở thẳng trang Admin (cần phiên đăng nhập sẵn)
    async moTrangAdmin() {
        await this.moTrang('admin/viewSystemUsers');
        await this.kiemTraDangOTrangAdmin();
    }

    // Kiểm tra đã vào đúng trang Admin chưa
    async kiemTraDangOTrangAdmin() {
        await expect(this.page).toHaveURL(/viewSystemUsers/);
        await expect(
            this.page.locator('.oxd-topbar-header-breadcrumb-module')
        ).toHaveText('Admin');
        await expect(this.bangKetQua()).toBeVisible({ timeout: 15000 });
    }

    async bamNutAddUser() {
        await this.page.getByRole('button', { name: 'Add' }).click();
        await this.page.waitForURL('**/admin/saveSystemUser');
        await expect(this.page.getByRole('heading', { name: 'Add User' })).toBeVisible();
    }

    // ----- Đọc bảng danh sách user -----

    // Ô ở cột `cot` của dòng thứ `chiSoDong`
    oCuaDong(chiSoDong, cot) {
        return this.dongKetQua()
            .nth(chiSoDong)
            .locator('.oxd-table-row > .oxd-table-cell')
            .nth(cot);
    }

    // Toàn bộ ô của 1 cột (mọi dòng). nth-child đếm từ 1 nên +1.
    toanBoCot(cot) {
        return this.dongKetQua().locator(`.oxd-table-row > .oxd-table-cell:nth-child(${cot + 1})`);
    }

    /**
     * Lấy giá trị ở dòng đầu tiên để làm từ khoá search.
     *
     * Không hardcode tên/username cụ thể, vì OrangeHRM demo là môi trường dùng
     * chung: dữ liệu bị người khác thêm/xoá/sửa liên tục. Lấy giá trị đang thực
     * sự có trong bảng thì search chắc chắn ra kết quả.
     */
    async layGiaTriDongDauTien(cot) {
        await expect(this.dongKetQua().first()).toBeVisible({ timeout: 15000 });
        const giaTri = chuanHoa(await this.oCuaDong(0, cot).innerText());
        expect(giaTri, 'Dòng đầu tiên phải có dữ liệu').not.toBe('');
        return giaTri;
    }

    async layTenNhanVienDongDauTien() {
        return this.layGiaTriDongDauTien(COT.TEN_NHAN_VIEN);
    }

    async layUsernameDongDauTien() {
        return this.layGiaTriDongDauTien(COT.USERNAME);
    }

    /**
     * Chờ tới khi MỌI dòng trong bảng ở cột `cot` đều thoả `dieuKien`.
     *
     * Sau khi bấm Search, bảng cũ vẫn hiển thị một nhịp rồi mới render lại.
     * Đếm/đọc ngay lúc đó sẽ ra danh sách cũ (hoặc 0 dòng khi đang load).
     * -> poll cho tới khi bảng thực sự phản ánh bộ lọc.
     * Trả về số dòng kết quả.
     */
    async doiKetQuaThoa(cot, dieuKien, moTa) {
        await expect
            .poll(async () => {
                const giaTri = (await this.toanBoCot(cot).allInnerTexts()).map(chuanHoa);
                return giaTri.length > 0 && giaTri.every(dieuKien);
            }, { timeout: 15000, message: moTa })
            .toBe(true);

        return await this.dongKetQua().count();
    }

    // ----- Bộ lọc "Employee Name" (ô gợi ý) -----

    /**
     * Search user theo ô gợi ý "Employee Name".
     * Trả về tên thực tế đã được chọn từ danh sách gợi ý
     * (có thể khác từ khoá gõ vào, nên phải lấy giá trị thật để assert).
     */
    async timTheoTenNhanVien(tuKhoa) {
        const tenDaChon = await this.chonGoiYTheoNhan('Employee Name', tuKhoa);
        await this.bamNutSearch();
        return tenDaChon;
    }

    /**
     * Mọi dòng kết quả đều phải là của đúng nhân viên đã search.
     *
     * Ô gợi ý trả về tên ĐẦY ĐỦ ("Maria M Jones") nhưng cột Employee Name
     * trong bảng lại bỏ middle name ("Maria Jones")
     * -> so khớp nguyên chuỗi luôn sai, chỉ kiểm tra họ và tên cuối.
     */
    async kiemTraKetQuaDungTenNhanVien(ten) {
        const tu = ten.split(' ').filter(Boolean);
        const ho = tu[0];
        const tenCuoi = tu[tu.length - 1];

        return this.doiKetQuaThoa(
            COT.TEN_NHAN_VIEN,
            (o) => o.includes(ho) && o.includes(tenCuoi),
            `Mọi dòng phải có Employee Name chứa "${ho}" và "${tenCuoi}"`,
        );
    }

    // ----- Bộ lọc "Username" (ô nhập thường, khớp CHÍNH XÁC) -----

    async timTheoUsername(username) {
        await this.dienTheoNhan('Username', username);
        await this.bamNutSearch();
    }

    async kiemTraKetQuaDungUsername(username) {
        return this.doiKetQuaThoa(
            COT.USERNAME,
            (o) => o === username,
            `Mọi dòng phải có Username đúng bằng "${username}"`,
        );
    }

    // ----- Bộ lọc "User Role" (dropdown: Admin / ESS) -----

    async timTheoUserRole(role) {
        await this.chonDropdownTheoNhan('User Role', role);
        await this.bamNutSearch();
    }

    async kiemTraKetQuaDungUserRole(role) {
        return this.doiKetQuaThoa(
            COT.USER_ROLE,
            (o) => o === role,
            `Mọi dòng phải có User Role là "${role}"`,
        );
    }

    // ----- Reset -----

    // Sau khi Reset, mọi ô lọc phải về trạng thái ban đầu
    async kiemTraDaResetBoLoc() {
        await expect(this.nhomTruong('Username').locator('input')).toHaveValue('');
        await expect(this.nhomTruong('Employee Name').locator('input')).toHaveValue('');
        await expect(
            this.nhomTruong('User Role').locator('.oxd-select-text-input')
        ).toHaveText('-- Select --');
    }
}

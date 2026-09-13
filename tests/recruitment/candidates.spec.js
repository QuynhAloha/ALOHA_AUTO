import { test, expect } from '@playwright/test';

import { RecruitmentPage } from '../../pages/RecruitmentPage.js';
import { taoDuLieuUngVien, SO_TRUONG_BAT_BUOC_CANDIDATE } from '../data/candidates.data.js';
import { dungLai } from '../../utils/quanSat.js';

/**
 * Recruitment > tab Candidates.
 * Dùng phiên đăng nhập lưu sẵn -> mở thẳng tab Candidates.
 * Mỗi test tự tạo dữ liệu riêng (tên unique), không phụ thuộc test khác.
 */
test.describe('Recruitment - Candidates', () => {

    let recruitmentPage;

    test.beforeEach(async ({ page }) => {
        recruitmentPage = new RecruitmentPage(page);
        await recruitmentPage.moTrangCandidates();
    });

    test('Tạo Candidate mới thành công', async ({ page }) => {
        const ungVien = taoDuLieuUngVien();

        await recruitmentPage.moFormThemUngVien();
        // themUngVien đã tự chờ chuyển sang trang chi tiết /addCandidate/<id>
        await recruitmentPage.themUngVien(ungVien);

        await dungLai(page, 3);
    });

    test('Search Candidate vừa tạo -> đúng kết quả; Reset -> danh sách đầy đủ', async ({ page }) => {
        const ungVien = taoDuLieuUngVien();
        let soDongSauKhiSearch;

        await test.step('Chuẩn bị: tạo 1 Candidate mới để search', async () => {
            await recruitmentPage.moFormThemUngVien();
            await recruitmentPage.themUngVien(ungVien);
            await recruitmentPage.quayLaiDanhSachUngVien();
        });

        await test.step('Search theo lastName -> thấy đúng ứng viên', async () => {
            await recruitmentPage.timUngVienTheoTuKhoa(ungVien.lastName);
            await recruitmentPage.kiemTraUngVienCoTrongDanhSach(ungVien.hoTen);
            soDongSauKhiSearch = await recruitmentPage.dongKetQua().count();

            await dungLai(page, 3);
        });

        await test.step('Reset -> ô lọc trắng, danh sách trở về đầy đủ', async () => {
            await recruitmentPage.bamNutReset();
            await recruitmentPage.kiemTraDaResetBoLoc();
            await recruitmentPage.kiemTraDanhSachTroVeDayDu(soDongSauKhiSearch);

            await dungLai(page, 2);
        });
    });

    test('Bỏ trống trường bắt buộc -> 3 ô báo "Required", không lưu', async ({ page }) => {
        await recruitmentPage.moFormThemUngVien();
        await recruitmentPage.bamNutLuu();

        // First Name + Last Name + Email
        await recruitmentPage.kiemTraBaoLoiBatBuoc(SO_TRUONG_BAT_BUOC_CANDIDATE);
        await recruitmentPage.kiemTraTruongBaoBatBuoc('Email');
        // Vẫn ở form thêm mới, chưa sinh ra bản ghi (URL chưa có /<id>)
        await expect(page).toHaveURL(/recruitment\/addCandidate$/);

        await dungLai(page, 3);
    });
});

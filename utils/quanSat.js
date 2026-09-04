/**
 * Chế độ QUAN SÁT: dừng giữa các bước và gõ input chậm lại
 * để mắt thường theo kịp khi chạy --headed.
 *
 * Mặc định: BẬT.
 * Tắt khi chạy nhanh / chạy CI:  PAUSE=0 npx playwright test
 */
export const CHE_DO_QUAN_SAT = process.env.PAUSE !== '0';

// Độ trễ giữa 2 ký tự khi gõ (ms)
export const DO_TRE_GO_PHIM = CHE_DO_QUAN_SAT ? 80 : 0;

export async function dungLai(page, giay) {
    if (!CHE_DO_QUAN_SAT) return;
    await page.waitForTimeout(giay * 1000);
}

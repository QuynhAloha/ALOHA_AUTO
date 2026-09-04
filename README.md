# Aloha_AUTO

Automation UI testing cho **OrangeHRM Demo** bằng [Playwright](https://playwright.dev/), tổ chức theo mô hình Page Object Model (POM).

- **AUT:** OrangeHRM Demo
- **Base URL:** https://opensource-demo.orangehrmlive.com/web/index.php/

## Cấu trúc

```
pages/     Page Objects (BasePage + các page kế thừa)
tests/     Test specs
utils/     Test data generator & chế độ quan sát
```

| File | Vai trò |
|---|---|
| `pages/BasePage.js` | Hành động dùng chung: điền form theo label, dropdown, autocomplete, bảng kết quả, Save/Search/Reset |
| `pages/LoginPage.js` | Mở trang, đăng nhập, xác nhận vào Dashboard |
| `pages/DashboardPage.js` | Điều hướng menu trái sang các module |
| `pages/AdminPage.js` | Module Admin (User management) |
| `pages/RecruitmentPage.js` | Tab Candidates: tạo / search / reset filter |
| `pages/VacancyPage.js` | Tab Vacancies: tạo / search / reset filter |
| `utils/testData.js` | Sinh dữ liệu unique theo timestamp (demo site dùng chung) |
| `utils/quanSat.js` | Chế độ quan sát: gõ chậm + dừng giữa các bước |

## Cài đặt

```bash
npm install
npx playwright install
```

## Chạy test

```bash
# Full flow Recruitment, có mở trình duyệt để quan sát
npx playwright test tests/recruitment/recruitment.spec.js --project=chromium --headed

# Chậm lại từng thao tác (500ms/step)
SLOWMO=500 npx playwright test tests/recruitment/recruitment.spec.js --project=chromium --headed

# Chạy nhanh, không dừng quan sát (dùng cho CI)
PAUSE=0 npx playwright test --project=chromium

# Xem report
npx playwright show-report
```

## Biến môi trường

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `PAUSE` | bật | `PAUSE=0` tắt chế độ quan sát (bỏ dừng giữa các bước, gõ nhanh) |
| `SLOWMO` | `0` | Độ trễ (ms) giữa mỗi thao tác của Playwright |

## Test hiện có

- `tests/recruitment/recruitment.spec.js` — Full flow 10 bước: Login → Recruitment → tạo Candidate → search → reset filter → tab Vacancies → tạo Vacancy → search → reset filter
- `tests/orangehrm.spec.js` — POM flow: Login → Admin → mở form Add User

Chi tiết phạm vi automation: [tests/Aloha_AUTO/projectContext.md](tests/Aloha_AUTO/projectContext.md)

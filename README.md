# Aloha_AUTO

[![Playwright Tests](https://github.com/QuynhAloha/ALOHA_AUTO/actions/workflows/playwright.yml/badge.svg)](https://github.com/QuynhAloha/ALOHA_AUTO/actions/workflows/playwright.yml)

Automation UI testing cho **OrangeHRM Demo** bằng [Playwright](https://playwright.dev/), tổ chức theo mô hình Page Object Model (POM).

- **AUT:** OrangeHRM Demo
- **Base URL:** https://opensource-demo.orangehrmlive.com/web/index.php/

## Cấu trúc

```
pages/                      Page Objects (BasePage + các page kế thừa)
tests/
├── data/                   Dữ liệu test tách riêng theo page:
│                           login · dashboard · admin · candidates · vacancies
├── setup/auth.setup.js     Đăng nhập Admin 1 lần, lưu phiên cho mọi test dùng lại
├── auth/                   Login: đúng · sai mật khẩu · bỏ trống · đăng xuất
├── dashboard/              Dashboard: breadcrumb · menu trái · điều hướng sang module
├── admin/                  Admin > Users: search Employee Name / Username / User Role · reset · Add User
├── recruitment/
│   ├── candidates.spec.js  Tạo · search + reset · bỏ trống trường bắt buộc
│   └── vacancies.spec.js   Tạo · search + reset · bỏ trống trường bắt buộc
└── e2e/                    Flow xuyên module từ trang login (smoke test)
utils/                      Test data generator, chế độ quan sát
docs/                       Tài liệu phạm vi automation
```

**Nguyên tắc:** mỗi Page Object có đúng một file test tương ứng, mỗi test độc lập và chỉ kiểm 1 mục đích. Flow dài xuyên module chỉ giữ ở `e2e/`. Dữ liệu test không hardcode trong file test: data của từng page nằm ở `tests/data/<page>.data.js`, còn `utils/testData.js` chỉ giữ tiện ích dùng chung (sinh mã unique, cấu hình phiên đăng nhập).

| Page Object | File test |
|---|---|
| `LoginPage.js` | `tests/auth/login.spec.js` |
| `DashboardPage.js` | `tests/dashboard/dashboard.spec.js` |
| `AdminPage.js` | `tests/admin/users.spec.js` |
| `RecruitmentPage.js` | `tests/recruitment/candidates.spec.js` |
| `VacancyPage.js` | `tests/recruitment/vacancies.spec.js` |
| `BasePage.js` | *(class cha, test gián tiếp qua mọi page con)* |

Mỗi page có 1 file test và 1 file data đi kèm:

| Page | File test | File data |
|---|---|---|
| Login | `tests/auth/login.spec.js` | `tests/data/login.data.js` |
| Dashboard | `tests/dashboard/dashboard.spec.js` | `tests/data/dashboard.data.js` |
| Admin | `tests/admin/users.spec.js` | `tests/data/admin.data.js` |
| Candidates | `tests/recruitment/candidates.spec.js` | `tests/data/candidates.data.js` |
| Vacancies | `tests/recruitment/vacancies.spec.js` | `tests/data/vacancies.data.js` |

| Page Object | Vai trò |
|---|---|
| `pages/BasePage.js` | Dùng chung: mở trang theo đường dẫn, điền form theo label, dropdown, autocomplete, bảng kết quả, Save/Search/Reset, đăng xuất, lỗi "Required" |
| `pages/LoginPage.js` | Mở trang, đăng nhập, kiểm tra thành công / sai thông tin |
| `pages/DashboardPage.js` | Điều hướng menu trái sang các module |
| `pages/AdminPage.js` | Admin > Users: search theo 3 bộ lọc, đọc bảng, reset |
| `pages/RecruitmentPage.js` | Tab Candidates: tạo / search / reset |
| `pages/VacancyPage.js` | Tab Vacancies: tạo / search / reset |

## Đăng nhập 1 lần (storageState)

Project `setup` trong `playwright.config.js` chạy **trước** mọi test: đăng nhập Admin qua UI rồi lưu cookie ra `playwright/.auth/admin.json` (đã gitignore). Các test sau nạp lại phiên này và mở thẳng trang cần test bằng `moTrang()` của BasePage, không đi qua trang login nữa.

Ngoại lệ: `tests/auth/` và `tests/e2e/` dùng phiên trống (`PHIEN_TRONG`), vì chúng cần bắt đầu từ trạng thái chưa đăng nhập.

Chạy riêng 1 file vẫn tự kéo `setup` chạy trước, không cần làm gì thêm.

## Cài đặt

```bash
npm install
npx playwright install chromium
```

## Chạy test

| Lệnh | Chạy gì |
|---|---|
| `npm test` | Toàn bộ, headless, không dừng quan sát (giống CI) |
| `npm run test:headed` | Toàn bộ, mở trình duyệt |
| `npm run test:slow` | Toàn bộ, chậm 500ms/thao tác, từng test một |
| `npm run test:auth` hoặc `npm run test:login` | Chỉ Login |
| `npm run test:dashboard` | Chỉ Dashboard |
| `npm run test:admin` | Chỉ Admin |
| `npm run test:candidates` | Chỉ Candidates |
| `npm run test:vacancies` | Chỉ Vacancies |
| `npm run test:recruitment` | Candidates + Vacancies |
| `npm run test:e2e` | Flow E2E xuyên module |
| `npm run test:ui` | UI Mode, chọn test bằng giao diện |
| `npm run report` | Mở HTML report lần chạy gần nhất |

## Biến môi trường

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `PAUSE` | bật | `PAUSE=0` tắt chế độ quan sát (bỏ dừng giữa các bước, gõ nhanh) |
| `SLOWMO` | `0` | Độ trễ (ms) giữa mỗi thao tác của Playwright |

## CI

GitHub Actions (`.github/workflows/playwright.yml`) chạy `PAUSE=0 npx playwright test --project=chromium` trên mọi push/PR. HTML report luôn được upload làm artifact, còn trace và screenshot chỉ upload khi có test fail.

Chi tiết phạm vi automation: [docs/projectContext.md](docs/projectContext.md)

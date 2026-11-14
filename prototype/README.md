## Current demo storage and CRM — 14/11/2026

This section supersedes historical in-memory-only notes below. Main demo now stores a versioned snapshot under `thinh-an.demo.v1` in localStorage: cart, checkout draft, orders, stock, affiliate accounts/attribution, quotes, care/activity, customer notes and chat history/draft. The comparison Astryx dashboard reads the same snapshot. No server, cross-device sync, authentication, live messaging or payment integration.

Admin top bar has a confirmed reset of this app key only. Invalid snapshots are not overwritten; storage failures show feedback. A competing tab's newer snapshot blocks subsequent writes from the stale tab until reload. Browser storage can be cleared by the user/browser; use fictional contacts.

Chat's “Nhờ tư vấn riêng” captures name, phone and need through validated addQuote semantics, tags source `chatbot`, deduplicates matching open phone/need requests and feeds care and customer profiles. Customer detail groups +84/0 phone variants, shows order/quote history and supports timestamped notes. Order detail shows activity history. Inventory warns when available (stock minus reserved) is <=5; adjustments also record events.

Tests: `npm test` (18 tests) plus `.scratch/che-thinh-an/qa/persistent-crm.js` and checkout regression. QA browser contexts isolate local data from user's demo. New PDF refresh is not part of this implementation pass.

# Thịnh An — demo phục vụ chào bán

Prototype nội bộ; không phải hệ thống production. Câu hỏi: hướng hình ảnh và luồng mua/quản trị này có đủ để trình bày các gói dịch vụ với HTX không?

## Chạy

Tại thư mục gốc dự án:

```sh
npm run dev
```

Mở http://127.0.0.1:4186/prototype/ . Không cần cài dependency ứng dụng; cần Node để chạy npm/test và Python 3 để phục vụ file.

## Hướng đã chốt: A — Miền trà

Ngày 08/11/2026, người dùng chọn A — Miền trà: ảnh thu hái tràn khung, câu chuyện vùng trà làm điểm bắt đầu. Đã bỏ hai mẫu B/C, thanh chuyển mẫu và phím tắt đổi giao diện. Các URL cũ có tham số variant vẫn mở duy nhất mẫu A. Dữ liệu demo vẫn đặt lại khi tải lại trang.

## Luồng thử

1. Vào bộ sưu tập, tìm/lọc sản phẩm, xem chi tiết, thêm vào giỏ và điều chỉnh số lượng.
2. Nhập thông tin mẫu ở checkout. Ví dụ: Khách thử, 0900000000, Địa chỉ mẫu Hà Nội.
3. COD: đặt đơn → quản trị → xác nhận → đang giao → đã giao → mô phỏng nhận tiền COD.
4. QR/mở app: đặt đơn → minh họa màn thanh toán → mô phỏng nhận thanh toán → quản trị. QR hiển thị là placeholder không thể thanh toán; nút mở app không gọi ngân hàng.
5. Quà doanh nghiệp: gửi yêu cầu mẫu → xem trong quản trị / Yêu cầu báo giá.
6. Quản trị có danh sách/tìm đơn, chi tiết, kho, hồ sơ khách và lịch sử đơn. Điều chỉnh tồn không được thấp hơn lượng đã giữ.

## Dữ liệu & giới hạn

- Tên/ảnh sản phẩm lấy từ [thư viện nguồn](../assets/reference/README.md). Giá trong state.mjs là giá demo riêng, không sửa dữ liệu giá thật còn trống ở thư viện.
- Hàng được giữ khi đặt đơn; xuất kho khi chuyển sang đang giao; hủy trước giao giải phóng lượng giữ. Không có thời hạn giữ hàng trong demo.
- Tiền COD: chưa thanh toán → đã thu hộ/chờ đối soát → đã nhận tiền COD.
- Chưa hỗ trợ hoàn hàng/hoàn tiền tự động, xác thực tài khoản, phân quyền, dữ liệu bền vững, kế toán hay CRM chăm sóc.
- Không gọi API thanh toán, vận chuyển, nhận tiền hoặc gửi dữ liệu biểu mẫu ra ngoài. Không có backend. Google Fonts được tải qua stylesheet; liên kết bài báo/Facebook dẫn ra trang nguồn khi bấm.
- Ảnh báo chí dùng cho đánh giá nội bộ, chưa xác nhận quyền xuất bản. Trước production cần ảnh được phép sử dụng, giá/quy cách/chứng nhận được HTX chốt.
- Người dùng đã chọn mẫu A; tích hợp vận hành và thanh toán thật vẫn chưa triển khai.

## Kiểm tra

```sh
npm test
```

Bốn test Node kiểm tra số tiền, giữ/xuất kho, hủy đơn, ngăn bán quá tồn, thanh toán trả trước, thu hộ/đối soát COD và từ chối dữ liệu sai.

Đã thử trong Chromium bằng Playwright:
- COD đầy đủ đến đối soát; QR và mở app mô phỏng; biểu mẫu quà doanh nghiệp; sửa tồn kho.
- Tìm kiếm rỗng, đóng giỏ bằng Escape, skip link bằng bàn phím, đổi variant và cập nhật URL.
- Desktop 1440×1000, mobile 390×844; kiểm tra tràn ngang 320 px cho cả ba trang chủ. Các trang catalog, chi tiết, quà, báo chí, quản trị đơn/kho/khách không tràn ngang ở 390 px; không có ảnh lỗi trong lượt kiểm tra.
- Không có lỗi JavaScript trong lượt kiểm tra cuối. Đã sửa render lặp do popstate/hashchange và pattern điện thoại trước khi thử lại.

Ảnh QA nằm trong [qa](qa/). Chưa kiểm thử Safari, thiết bị thật, accessibility bằng screen reader hoặc dịch vụ ngân hàng/giao hàng thật.

## Tham khảo thiết kế

Chỉ tham khảo bố cục, không sao chép tài sản Mobbin:
- [MANA — hero dẫn bằng hình ảnh](https://mobbin.com/sites/sections/35a3baf2-74ae-4890-b2a1-7573e0585652)
- [lululemon — checkout và tổng đơn tách cột](https://mobbin.com/screens/e0b7545c-852b-43ca-90e8-cb0a10d2666f)

## Chờ đánh giá

Đã chốt A — Miền trà. Tiếp tục hoàn thiện prototype này theo phản hồi người dùng.

## Vercel preview — 07/11/2026

- Tài khoản/team: `tan-long` / `tan-longs-projects-77c881cd`; project `thinh-an-demo`.
- [Mở demo](https://thinh-an-demo-2ob1pwvwu-tan-longs-projects-77c881cd.vercel.app/prototype/) — trạng thái READY, truy cập công khai không cần đăng nhập (đã tắt Vercel Authentication theo yêu cầu).
- Triển khai từ thư mục staging chỉ chứa file tĩnh và ảnh thực sự được giao diện tham chiếu. Hai JPEG lớn được thu về tối đa 1920 px, chất lượng 80 trong staging; nguồn ảnh gốc giữ nguyên. Upload gói nguồn lớn bị chậm; bản staging tải thành công.
- Đã kiểm tra HTTP có xác thực: trang /prototype/, module app.mjs và ảnh hero trả 200; đường dẫn giữ dấu / cuối. Chưa chạy lại kiểm thử trình duyệt trên preview có bảo vệ.
- Plugin Vercel liên kết Huy Nguyen đã gỡ; CLI dùng tan-long.

Đã kiểm tra truy cập công khai bằng HTTP không cookie/token: trang demo và app.mjs trả 200.

## Cập nhật trang sản phẩm

Preview mới: https://thinh-an-demo-ov136jxld-tan-longs-projects-77c881cd.vercel.app/prototype/#/product/dinh-tra

Thu gọn ảnh, sắp xếp lại khu vực mua hàng, thêm Mua ngay (thêm số lượng đã chọn vào giỏ hiện có rồi đến checkout), bảng thông tin và sản phẩm liên quan. Ẩn thanh chuyển mẫu trên trang sản phẩm để không che nội dung mobile.

Đã thử thêm 2 hộp, mua ngay thêm 2 hộp và kiểm tra tổng giỏ; cả 3 trang sản phẩm không tràn ngang ở 320 px; 4 test trạng thái đơn/kho đạt. Đã mở preview bằng phiên trình duyệt mới không đăng nhập và đi từ sản phẩm đến checkout, không có lỗi JavaScript.

## Gợi ý mua thêm trong giỏ hàng

Preview mới: https://thinh-an-demo-g04plthap-tan-longs-projects-77c881cd.vercel.app/prototype/

Giỏ có hàng hiển thị tối đa 2 sản phẩm chưa chọn còn tồn khả dụng. Nút + Thêm cập nhật giỏ, tổng tiền và checkout; gợi ý tự ẩn khi tất cả sản phẩm đã được chọn. Đã thử trên mobile 320/390 px và desktop online; test trạng thái 4/4 đạt. Chưa có ưu đãi combo hoặc cá nhân hóa theo lịch sử mua.

Bản public đã chốt A: https://thinh-an-demo-44e5cjd51-tan-longs-projects-77c881cd.vercel.app/prototype/
Đã kiểm tra mẫu A trên mobile, URL tham số mẫu cũ, giỏ gợi ý và tài nguyên public sau deploy.

## Báo chí & sự kiện — rà soát 08/11/2026

Đã rà 10/10 URL trong articles.json, tất cả trả HTTP 200 khi tải trực tiếp. Đối chiếu tiêu đề, nội dung liên quan HTX và ngày đăng; Nhân Dân không có ngày xác định nên để trống. Nhật ký kiểm tra: .scratch/che-thinh-an/press-audit.json. Trang chủ có 3 bài tiêu biểu, trang journal có đủ 10 bài từ 7 nguồn, lọc theo báo, tách sự kiện Facebook.

Preview: https://thinh-an-demo-78vcltui6-tan-longs-projects-77c881cd.vercel.app/prototype/#/journal

Kiểm tra: đủ 10 URL duy nhất; lọc Báo Thái Nguyên trả 3 bài; liên kết từ trang chủ; không tràn ngang 320/390 px; không lỗi JS trong lượt thử; bản public có đủ bài và ảnh sự kiện tải được. Phạm vi là toàn bộ danh sách đã sưu tầm, không khẳng định bao phủ toàn bộ Internet.

## Chuyển sự kiện Facebook thành bài nội bộ

Ba mục sự kiện hiện có (Trại Cài, Tây Bắc – Lào Cai, Sơn La) được biên tập lại thành bài tại #/journal/<slug>, gồm phần dẫn, nội dung, hai ảnh có chú thích và bài liên quan. Đã bỏ nhãn nguồn/link Facebook khỏi giao diện, ảnh sản phẩm mở file nội bộ; thông tin nguồn vẫn lưu trong manifest và .scratch/che-thinh-an/event-editorial.json. Mười bài báo vẫn liên kết về báo gốc. Nội dung sự kiện được biên tập từ tư liệu đã lưu, không phải sao chép nguyên văn hay xác nhận mới từ HTX.

Preview: https://thinh-an-demo-416rpi9hq-tan-longs-projects-77c881cd.vercel.app/prototype/#/journal

Đã kiểm tra cả ba tuyến bài, tải lại URL trực tiếp, ảnh, bài liên quan, quay về danh sách, không tràn ngang ở 320 px; bản public và ảnh mới tải được.

## Ảnh cho danh sách báo chí

Đã chuyển 10 bài sang dạng thẻ ảnh; bổ sung ảnh bài gốc cho Dân Việt, Kinh tế và Đồ uống, Báo Thái Nguyên. Hai bài Cây chè xưa / Xây thương hiệu mạnh dùng ảnh minh họa có nhãn vì ảnh gốc lỗi; nguồn ảnh lưu trong manifest. Kiểm tra đủ 10 ảnh tải được ở local và public, lọc nguồn đúng và không tràn ngang 320/390 px.

Preview: https://thinh-an-demo-3npx875l9-tan-longs-projects-77c881cd.vercel.app/prototype/#/journal

## Dọn nội dung giao diện và bổ sung sản phẩm — 13/11/2026

Theo yêu cầu người dùng, bỏ thông báo prototype/demo và ghi chú nội bộ ở đầu/cuối trang, danh mục, chi tiết, giỏ, checkout, xác nhận, biểu mẫu báo giá và quản trị. Giữ thông báo lỗi thao tác và các ghi nguồn ảnh/báo. Thanh toán và dữ liệu vẫn chỉ trong bộ nhớ, chưa có kết nối thật.

Thêm bốn SKU trung-du, tui-loc, matcha, che-den với giá/quy cách/tồn và bao bì SVG dựng mẫu. Đây không phải bao bì hay báo giá được HTX xác nhận. Danh mục có 7 sản phẩm, bộ lọc lấy từ danh mục; trang chủ giữ 3 sản phẩm tiêu biểu.

Kiểm tra: 5 test trạng thái đạt, gồm đặt/giữ/xuất kho cả 4 SKU mới. Kiểm tra 13 tuyến trên mobile, 7 ảnh sản phẩm, checkout COD, không có lỗi JS hoặc ghi chú demo còn hiển thị trong các luồng đã thử.

Public: https://thinh-an-demo-89f26ssoq-tan-longs-projects-77c881cd.vercel.app/prototype/
Đã xác minh danh mục public có đủ 7 sản phẩm và ảnh SVG tải được.

## Quà doanh nghiệp — thiết kế lại

Trang giới thiệu quà theo ba phương án Thanh vị / Tâm giao / Tri ân, có sản phẩm, giá phần trà, nhóm người nhận; tiếp theo là hướng dẫn chọn quà và form tư vấn. Chọn phương án tự điền lựa chọn/ngân sách. Form thêm dịp tặng, ngân sách, ngày nhận; các trường này được lưu cùng lời nhắn trong yêu cầu báo giá hiện có, không thêm dịch vụ ngoài.

Đã kiểm tra chọn Tâm giao tự điền đúng, gửi yêu cầu giữ đủ phương án/ngân sách/ngày nhận/lời nhắn trong quản trị; mobile 320/390 px không tràn ngang. Các phương án và giá vẫn là thiết kế mẫu, chưa có báo giá doanh nghiệp chính thức hay gửi yêu cầu ra ngoài.

Preview: https://thinh-an-demo-oxf594m2c-tan-longs-projects-77c881cd.vercel.app/prototype/#/gifts

## Link cố định cho các lần cập nhật

Dùng https://thinh-an-demo.vercel.app/prototype/ làm link gửi người dùng. Ngày 13/11/2026 phát hiện alias còn trỏ bản cũ trong khi preview mới đã sẵn sàng; đã trỏ cả thinh-an-demo.vercel.app và thinh-an-demo-tan-longs-projects-77c881cd.vercel.app đến dpl_82MJPdHvHMVcbkTtskM2abkZuNQq. Sau mỗi lần deploy cần cập nhật hai alias này sang bản đã kiểm tra. Không chỉ gửi URL deployment mới.

### 2026-11-13 — Photo credit display
Removed visible photo-source captions from the homepage hero, story block, and story landscape. Source provenance remains in reference files; press publisher links remain intact. Build and syntax checks passed. Deployed as `dpl_C3799Dh4stic1A31djL1DxaKtihj`; both stable Vercel aliases updated.

## 2026-11-13 — Redesign từ nghiên cứu website trà

Trang chủ dùng bố cục bàn trà, ba lối chọn theo nhu cầu, quà biếu, người làm trà và nhật ký. Chi tiết sản phẩm có gallery bao bì/bàn trà/vùng chè; quà doanh nghiệp có lọc ngân sách và thành phần từng phương án. Giữ luồng giỏ hàng, upsell, checkout và quản trị hiện có.

Validation: 5/5 state tests; build kiểm tra asset và ranh giới deploy. Browser checks: 6 trang chính ở 320/390/1440 px không tràn ngang; bộ lọc quà 3 nhóm và tất cả; chọn Tâm giao tự điền; gửi form thành công; gallery chuyển ảnh; đặt COD thành công; ảnh trang chủ tải đủ. Check COD đầu tiên tìm chữ COD trong xác nhận nhưng giao diện dùng câu tiếng Việt, đã sửa assertion đúng nội dung và chạy lại đạt.

Giới hạn: ảnh có sẵn, chưa chụp lại bộ sản phẩm; giá/quy cách mẫu chưa được HTX xác nhận. Đơn hàng, báo giá, kho và thanh toán vẫn trong bộ nhớ, không gửi giao dịch hay yêu cầu thật.

Public: https://thinh-an-demo.vercel.app/prototype/

Deployment: `dpl_FVGhgvTrxo5qJWATz2ADWrsrHBcF` (`thinh-an-demo-7z8lg9a6g-tan-longs-projects-77c881cd.vercel.app`). Both stable aliases updated and public homepage/gift filter verified.

### Hero nhiều ảnh — 13/11/2026
Theo phản hồi người dùng, thay hero chia chữ/ảnh bằng bốn ảnh phủ toàn bộ chiều ngang: bàn trà, vùng chè, Huyền Trà Xưa, hộp Đinh trà. Desktop gần đầy màn hình; mobile ảnh chính và ba ảnh phụ. Kiểm tra tải đủ bốn ảnh và không tràn ngang ở 320/390/1440 px; đã xem screenshot desktop/mobile.

### Hero một ảnh — 13/11/2026
Theo điều chỉnh mới nhất: bỏ ba ảnh phụ, dùng một ảnh bàn trà full-width gần trọn màn hình. Build đạt; một ảnh tải được, không tràn ngang ở 320/390/1440px.

## Mobbin UI pass — 13/11/2026

User requested a site-wide UI revision using Mobbin MCP. References and rationale: [Mobbin review](../.scratch/che-thinh-an/research/mobbin-ui/README.md). The shared `commerce.css` layer standardizes navigation, product cards, catalog, PDP, editorial pages, gifts, cart, checkout, confirmation and administration. Build copies this stylesheet with the public prototype. No new dependencies.

Header now uses an accessible mobile disclosure with Escape/focus restoration; active navigation is consistent. Card add buttons reflect available quantity. Route changes scroll immediately to the top. Existing commerce state, validation and mock-only payment behavior remain.

Validation: 5 state tests; build; 40 responsive route combinations; scripted browser journeys at 320/390/1440px; stock boundary/recovery; scrollable inventory table; QR/bank layouts. No JS errors in tested routes. QA script and reference notes are excluded from deployment. Real banking, persisted CRM, real device Safari and replacement product photography are outside this pass.

Public deployment: `dpl_J1vzFrD4XnHhskaNKm38ps9xPg3q` — https://thinh-an-demo.vercel.app/prototype/ . Both stable aliases point to this revision; public theme, one-image hero, mobile menu, catalog and cart verified.

## Compact gift enquiry — 13/11/2026
Reduced the gift form to name, phone, optional quantity and optional note. Selected gift is retained without a repeated selector. Company/date/budget/occasion fields removed; company remains optional for backwards-compatible records. Unknown quantity is null, displayed as chưa xác định in administration. Six state tests pass; desktop/mobile browser submissions checked with contact only and a selected offer plus quantity.

## Social buttons — 13/11/2026
Added compact circular Zalo/Facebook/TikTok buttons in the footer, gift enquiry area and a floating right-side dock. Facebook uses the user-supplied PhamTienDat28 page. User explicitly authorized mocks for missing Zalo/TikTok accounts; these show an availability message and do not navigate to guessed accounts. Dock omitted on checkout/confirmation to avoid obstructing payment controls. Browser checks covered button count, Facebook href, mock clicks and mobile overflow.

## Inline cart checkout — 13/11/2026

Cart checkout now expands the existing drawer instead of navigating to a separate checkout route. Desktop shows cart/upsell/totals beside the shipping/payment form; mobile stacks cart summary and form in the same drawer. Buy now opens this expanded state. Confirmation and mock QR/bank UI remain in the same dialog. Existing `/checkout` URLs open the drawer over the storefront for compatibility.

Draft shipping/payment fields survive quantity changes, upsell, back to cart, close/reopen and removal/re-addition; draft clears after a completed order. Totals, stock validation, COD handling and admin state reuse existing functions. No persistence or real banking added.

Validation: 6 state tests and build passed. `../.scratch/che-thinh-an/qa/inline-checkout.js` verifies 1440/768/390/320px: one dialog, expansion, unchanged URL, drafts, quantity totals, close/back, COD, buy-now, inline QR confirmation. Existing complete UI journeys pass at 1440/390/320px. Additional checks cover legacy route, last-item removal and inline bank error state. Screenshots inspected on desktop/mobile; no real device or banking integration tested.

### Affiliate demo (2026-11-13)
- Registration: `#/affiliate`; partner view: `#/affiliate/dashboard`; operations: `#/admin/affiliates`.
- Seeded partner `ANNHIEN` accepts `?ref=ANNHIEN`. A newly approved partner's Open store link preserves the current in-memory session; copied links for newly created accounts cannot resolve after reload or in another tab.
- 10% sample commission, excluding shipping, snapshotted on order creation. COD must be delivered and remitted before commission payout recording. Paid reversals retain payout history and show recovery due; no funds move.
- Account switching is for demo review, not authentication. No real identities, cross-session storage, analytics deduplication, partial-return accounting, or payment transfers.
- QA: `node --test prototype/state.test.mjs`, `.scratch/che-thinh-an/qa/affiliate.js` with local HTTP server on 4189.
- Commercial scope and production prerequisites: `output/pdf/thinh-an-ke-hoach-website-cham-soc-khach-hang.pdf`; PDF generator: `scripts/build-care-plan.py` (reportlab/pypdf and macOS Arial fonts).

### Tracking and resource library (2026-11-13)
- `#/tracking`: sample TA1024 with 0900000001, TA1023 with 0900000002. Uses in-memory code+phone matching only, not authentication. Newly created orders disappear on reload. Live customer use requires server-side OTP, access control/rate limiting, persistence and carrier integration.
- `#/affiliate/resources`: download two existing product images and copy captions with current approved partner/product referral URLs. Pending partners get images only. No automatic social posting. Rights and product facts must be confirmed before production use.
- QA: `.scratch/che-thinh-an/qa/tracking-resources.js` (local port 4189), plus 13 state tests.

### Clean URL update
Current links use `/affiliate/resources`, `/affiliate/dashboard`, `/tracking`, `/catalog` etc. Legacy `/prototype/#/...` links still normalize on load. Vercel explicit route rewrites serve the root app entry; static files stay at root-relative paths. Build with `npm run build`, then use `.scratch/che-thinh-an/qa/serve-clean.py` on port4190 for clean-route QA. Opening clean deep routes requires a fallback-capable server, not the old bare Python root server.

## Presentation kit — 14/11/2026

Open `/admin/presentation` for the current guided business demo. Use fictional customer `Khách trình diễn`, phone `0900000088`, one Tôm nõn and `?ref=ANNHIEN`. Expected COD 310,000 VND; commission 28,000 VND after delivery and COD remittance. The page links to the matching newest order; never assumes TA1025 unless reset and no prior new orders. Preparation/reset is manual and confirmed. Optional branch covers chatbot leads, customer notes, tracking and stock warnings. Rehearsal: `.scratch/che-thinh-an/qa/presentation.js`.

Current PDF: `output/pdf/thinh-an-ke-hoach-website-cham-soc-khach-hang.pdf`, 11 pages, with current storage/CRM scope and presentation runbook on pages 10–11. Supersedes earlier PDF/storage limitations in historical notes.

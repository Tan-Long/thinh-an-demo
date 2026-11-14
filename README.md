# Thịnh An — Website & Admin Demo

Website giới thiệu và bán trà, quà doanh nghiệp, quản trị đơn hàng/kho/khách hàng và cộng tác viên.

- Website: https://thinh-an-demo.vercel.app
- So sánh hai hướng: https://thinh-an-demo.vercel.app/compare/
- Hướng 2: https://thinh-an-demo.vercel.app/concept-2/
- Admin: https://thinh-an-demo.vercel.app/admin
- Affiliate: https://thinh-an-demo.vercel.app/admin/affiliates

## Chạy tại máy

Cần Node.js 20+ với npm và Python 3. Chạy tại thư mục gốc:

```sh
npm ci --prefix prototype/astryx
npm test
npm run build
npm run dev
```

Mở http://127.0.0.1:4186 hoặc http://127.0.0.1:4186/admin. Sau khi sửa mã nguồn, chạy lại `npm run build` rồi tải lại trang. Máy chủ local chỉ phục vụ thư mục `dist` và hỗ trợ đường dẫn SPA.

## Tính năng

- Danh mục, trang sản phẩm, giỏ hàng và checkout mở rộng; mô phỏng COD/QR.
- Nội dung thương hiệu, báo chí, quà doanh nghiệp và chatbot tư vấn mô phỏng.
- Quản trị đơn hàng, tồn kho, khách hàng, yêu cầu báo giá và chăm sóc khách.
- Affiliate: giới thiệu đơn, hoa hồng, đối soát và thu hồi mô phỏng.
- Dashboard bán hàng/hoa hồng: dữ liệu mẫu 30 ngày, bộ lọc ngày, so sánh kỳ trước, trung bình/min/max và tooltip từng ngày.

## Cấu trúc

- `prototype/`: giao diện chính bằng JavaScript modules, nghiệp vụ, localStorage và Node tests.
- `prototype/astryx/`: bản React đối chiếu affiliate và CSS Matcha dùng chung.
- `assets/reference/`: ảnh và tư liệu nguồn; xem README trong thư mục để biết xuất xứ.
- `scripts/build-demo.mjs`: đóng gói bản static vào `dist/`.
- `vercel.json`: build và rewrite cho Vercel. Không chứa liên kết tài khoản/project cá nhân.

## Triển khai

Import repository vào Vercel, chọn thư mục gốc. `vercel.json` khai báo lệnh cài dependencies, build, output `dist` và các SPA routes. Không cần biến môi trường cho demo.

## Phạm vi bản demo

Dữ liệu lưu trong localStorage của từng trình duyệt, có thể bị xóa và không đồng bộ giữa thiết bị. Admin công khai, chưa có đăng nhập/phân quyền hay backend. Chỉ nhập thông tin giả để thử nghiệm. Thanh toán, chatbot, liên hệ mạng xã hội và chi trả hoa hồng chưa kết nối dịch vụ thật.

Ảnh báo chí, logo và nhãn hiệu giữ quyền của chủ sở hữu tương ứng; repository public không cấp lại quyền sử dụng thương mại các tài sản này. Cần xác nhận quyền dùng ảnh trước khi vận hành thương mại. Không tự áp dụng giấy phép mã nguồn mở cho toàn bộ tư liệu.

PDF đề xuất, tài liệu nội bộ, cấu hình tài khoản, browser traces và ảnh QA không nằm trong repository. Các README bên trong có ghi chép lịch sử; hướng dẫn chạy hiện tại là tài liệu này.

## Hai hướng thiết kế

`concept-2/` giữ bản tham khảo riêng từ repo che-thinh-an-website; nguồn và commit được ghi trong README của thư mục. `comparison/` cung cấp trang chọn mẫu và thanh chuyển hướng. Build đặt bản hiện tại ở `/`, bản thứ hai ở `/concept-2/`, trang so sánh ở `/compare/`. Mỗi bản dùng bộ dữ liệu localStorage riêng.

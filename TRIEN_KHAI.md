# HƯỚNG DẪN TRIỂN KHAI VÀ VẬN HÀNH HỆ THỐNG AI CLASSROOM

Hệ thống **AI CLASSROOM – TRỢ LÝ LỚP HỌC THÔNG MINH** (Lớp 3C1 - Trường Tiểu học Hoài Nhơn - Cô Đỗ Thị Hoà) đã sẵn sàng triển khai mượt mà trên cả **Máy tính cục bộ (Localhost)** và **Đám mây Vercel (Miễn phí 100%)**.

---

## 🚀 CÁCH 1: KHỞI CHẠY NGAY TRÊN MÁY TÍNH (ĐANG CHẠY TRỰC TIẾP)

Hệ thống hiện đã được khởi chạy thành công và đang hoạt động tại địa chỉ:
👉 **http://localhost:3000**

* **Khởi động lại khi cần:** Nhấp đúp chuột vào file **`chay_ung_dung.bat`** tại thư mục gốc của dự án.
* **Hoặc bằng lệnh:** `npm run dev` (hoặc `npm start`).

---

## ☁️ CÁCH 2: TRIỂN KHAI TRỰC TUYẾN LÊN VERCEL (ĐỂ CHIA SẺ TRỰC TUYẾN)

Toàn bộ các file cấu hình triển khai Vercel đã được tối ưu:
- **`vercel.json`**: Cấu hình chuẩn SPA Rewrite, đảm bảo không bao giờ gặp lỗi 404 khi tải lại trang hoặc F5.
- **`dist/`**: Thư mục đóng gói bản production đã sẵn sàng (`npm run build`).

### Các bước triển khai lên Vercel:

### Bước 1: Đẩy mã nguồn lên GitHub
1. Mở phần mềm **GitHub Desktop** (hoặc tạo kho lưu trữ trên GitHub).
2. Đưa toàn bộ thư mục `quanlylophoc` lên tài khoản GitHub của bạn.
3. Nhấn **Push** để đẩy mã nguồn lên.

### Bước 2: Liên kết và Triển khai với Vercel
1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Nhấn nút **"Add New..."** ➔ Chọn **"Project"**.
3. Chọn Repository vừa tạo ➔ Nhấn **"Import"**.
4. Thiết lập cấu hình:
   - **Framework Preset**: Chọn **Vite**.
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Nhấn nút **"Deploy"**.

### Bước 3: Hoàn thành và nhận đường link trực tuyến
- Sau khoảng 1 phút, Vercel cấp đường link trực tuyến dạng:
  👉 **`https://ten-du-an-cua-ban.vercel.app`**
- Bạn có thể gửi link này cho Ban Giám Hiệu, Hội đồng Giám khảo, Phụ huynh và Học sinh sử dụng trực tiếp trên máy tính, điện thoại, máy tính bảng.

---

## 💾 CÁC TÍNH NĂNG ĐÃ NÂNG CẤP MỚI NHẤT

1. **Vào app trực tiếp tức thì:**
   - Hoàn toàn không yêu cầu APK/API Key khi khởi động.
   - Nút **`Khóa AI (Tùy chọn)`** trên Header hỗ trợ người dùng tự do nhập key Google Gemini nếu muốn, hoặc dùng ngay kho tri thức sư phạm tích hợp sẵn.

2. **Tính năng Lưu dữ liệu toàn diện (Save Feature):**
   - **Nút "Lưu dữ liệu"** màu xanh ngọc nổi bật trên thanh Header và chân Sidebar.
   - **Phím tắt nhanh `Ctrl + S`**: Bấm bất cứ lúc nào để lưu ngay tức thì.
   - **Thông báo Toast**: Báo trạng thái lưu thành công kèm mốc thời gian chi tiết.
   - **Tự động lưu ngầm (Auto-Save on Exit)**: Tự động bảo vệ dữ liệu khi tắt tab, đóng app, chuyển ứng dụng.
   - **Trung tâm Sao lưu & Khôi phục**: Xuất file `.json` toàn diện (tất cả lớp, học sinh, điểm, bài tập, học liệu, trò chơi) để cất vào USB hoặc khôi phục trên máy khác chỉ trong 1 giây.

---

## 👥 THÔNG TIN ĐĂNG NHẬP MẶC ĐỊNH
- **Giáo viên chủ nhiệm:**
  - Tên đăng nhập: `thhn_3c1` (hoặc `thhn_3a2`, `thhn_3a1`)
  - Mật khẩu: `Thhn_12@` (có thể đổi mật khẩu bất kỳ lúc nào)
- **Học sinh:**
  - Tên đăng nhập: `hs3c101`, `hs3c102`...
  - Mật khẩu: `123456`

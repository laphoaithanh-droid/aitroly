@echo off
chcp 65001 >nul
title AI CLASSROOM - TRƯỜNG TIỂU HỌC HOÀI NHƠN
echo ===================================================================
echo    ĐANG KHỞI CHẠY HỆ THỐNG AI CLASSROOM (TRỢ LÝ LỚP HỌC THÔNG MINH)
echo    Giáo viên: Đỗ Thị Hoà - Lớp 3C1 - Trường Tiểu học Hoài Nhơn
echo ===================================================================
echo.

if not exist node_modules (
    echo [THÔNG BÁO] Đang kiểm tra và cài đặt các thư viện cần thiết...
    call npm install
)

echo [1/2] Đang mở trình duyệt web...
start http://localhost:3000

echo [2/2] Đang khởi động máy chủ Web Server...
call npm run dev

pause

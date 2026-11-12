# Cài nhanh ThemeAI — Pixel Studio

## Chrome / Edge

1. Tải file **downloads/themeai-pixel-studio.zip** trong repo rồi giải nén. Hoặc tải toàn bộ repo bằng **Code → Download ZIP**.
2. Mở `chrome://extensions` hoặc `edge://extensions`.
3. Bật **Developer mode / Chế độ dành cho nhà phát triển**.
4. Bấm **Load unpacked / Tải tiện ích đã giải nén**.
5. Chọn thư mục **extension** nơi có `manifest.json`.
6. Tải lại ChatGPT/Codex hoặc Claude.

Không chọn toàn bộ thư mục repo hay file ZIP khi Load unpacked. Không cần chạy lệnh hoặc build lại.

## Tampermonkey

1. Cài Tampermonkey từ cửa hàng chính thức của trình duyệt.
2. Mở https://raw.githubusercontent.com/hpb282/themeAI/main/themeai.user.js rồi chọn **Install** nếu trình quản lý script hiện ra.
3. Nếu chỉ hiện mã, mở Tampermonkey → **Create a new script**, thay toàn bộ mã bằng nội dung `themeai.user.js`, nhấn **Ctrl+S**.
4. Nếu Chrome yêu cầu, bật **Allow User Scripts** trong chi tiết tiện ích Tampermonkey; bản cũ có thể yêu cầu Developer mode.
5. Tải lại các tab ChatGPT/Codex và Claude.

Chỉ cài một trong hai bản. Tắt bản Neon Studio cũ trước khi dùng theme pixel.

## Chỉnh theme

Bấm **✦ Pixel Studio** ở góc dưới phải để chọn Night, Forest hoặc Sakura, chỉnh độ sáng, bật/tắt chuyển động, sao, mây và tia sáng theo chuột. Lựa chọn lưu chung giữa các website bằng kho của tiện ích hoặc Tampermonkey.

**Chuyển góc** đưa bảng/nút sang bên còn lại trong tab hiện tại. **Khôi phục mặc định** trả về Night, độ sáng 70%.

Hệ thống bật giảm chuyển động sẽ giữ cảnh đứng yên và tắt vệt chuột. Tắt chuyển động cũng tắt vệt chuột. Tab ẩn dừng hiệu ứng.

## Gỡ

Tắt **Bật theme pixel** để trở lại màu gốc. Muốn gỡ hẳn: Remove tiện ích ở trang extensions, hoặc tắt/xóa userscript ở Tampermonkey Dashboard. Tải lại các tab sau khi gỡ.

## Hỗ trợ

Dành cho ChatGPT, Codex web và Claude tại các domain được ghi trong README. Không áp dụng cho ứng dụng desktop, điện thoại hay terminal. Nên dùng chế độ tối của ứng dụng AI.

Theme không đọc nội dung chat, không có yêu cầu mạng. Đây là theme bên thứ ba. Website thay đổi cấu trúc có thể cần cập nhật adapter CSS. Xem README để biết phạm vi đã kiểm thử và hướng dẫn phát triển.

# Thiệp Mời Tốt Nghiệp — Nguyễn Tuấn Phong (Cobalt Scholar)

Website thiệp mời tốt nghiệp trực tuyến thông minh, hiện đại, tối ưu tuyệt đối cho thiết bị di động và máy tính, được xây dựng lại dựa trên bản thiết kế gốc từ `thieptotnghiep.com`.

## 🌟 Tính Năng Nổi Bật

1. **Hiệu ứng Mở Phong Bì & Con Dấu Sáp 3D (Wax Seal Envelope):**
   - Phong bì mở đầu sang trọng với hiệu ứng ánh sáng xanh Cobalt và con dấu sáp cử nhân.
   - Nhấn vào con dấu sáp để bẻ khóa seal, nắp phong bì mở ra góc 180° theo không gian 3D.
   - Lá thư bên trong trượt lên mượt mà, chạm vào lá thư để mở toàn bộ thiệp và kích hoạt pháo hoa giấy (Confetti cannon) chúc mừng.
   
2. **Nhạc nền YouTube theo yêu cầu:**
   - Tích hợp video YouTube: `https://www.youtube.com/watch?v=b-FHfiM8ILo` (Lofi Chill Tiktok - Nhạc Chill Không Lời).
   - Tự động bắt đầu phát ngay khi người dùng chạm vào con dấu sáp (tuân thủ chính sách Autoplay trên trình duyệt di động iOS/Android).
   - **Nút loa nổi ở góc phải dưới màn hình:**
     - Thiết kế kính mờ Glassmorphism.
     - Khi phát nhạc: Sáng xanh Cobalt kèm 3 thanh sóng âm Equalizer chuyển động nhịp nhàng.
     - Khi tắt: Biểu tượng gạch chéo mute màu xám tinh tế.
     - Cho phép bật/tắt nhạc tức thì bất cứ lúc nào.

3. **Tối ưu hóa chuyên sâu cho điện thoại (Mobile First):**
   - Hỗ trợ Viewport Cover và an toàn viền màn hình (`env(safe-area-inset-bottom)` cho iPhone tai thỏ/Dynamic Island).
   - Thiết kế dạng lưới 2 cột Polaroid vừa vặn hoàn hảo trên màn hình 360px - 430px.
   - Hỗ trợ cử chỉ vuốt (Swipe Touch) qua lại khi xem ảnh toàn màn hình trong Lightbox.
   - Kích thước chạm (Touch target) tối thiểu 44px, không bao giờ bị vỡ bố cục hay tràn ngang (zero horizontal overflow).

4. **Đầy đủ các phân đoạn nội dung:**
   - **Hero Intro:** Thư mời trân trọng & thông điệp tri ân chặng đường sinh viên Đại học Bách Khoa.
   - **Hero Royal (Lễ Tốt Nghiệp Vinh Danh):** Khung viền hoàng gia ánh kim, tên tân cử nhân *Nguyễn Tuấn Phong*, ngành *Khoa học Máy tính*, trường *Đại Học Bách Khoa ĐHQG TPHCM*, câu châm ngôn ý nghĩa, thời gian ngày 28/11/2026 | 16:30.
   - **Lịch Trình (Timeline):** Các mốc đón khách chụp ảnh lưu niệm (04:30 PM) và tiệc liên hoan (06:00 PM) kèm đường nối sáng.
   - **Khoảnh Khắc Đại Học (Polaroid Gallery):** 16 tấm ảnh kỷ niệm thời đại học với hiệu ứng góc nghiêng ngẫu nhiên tự nhiên, phóng to khi rê chuột/chạm và tích hợp trình xem ảnh Lightbox độ phân giải cao. Toàn bộ 16 ảnh đã được tải về lưu trữ cục bộ trong thư mục `images/` (có cơ chế dự phòng CDN).
   - **Địa Điểm (Map):** Tích hợp Google Maps Bách Khoa TP.HCM (Cổng 1 Lý Thường Kiệt), nút Sao chép địa chỉ nhanh và nút Chỉ đường trực tiếp sang Google Maps.
   - **Đếm Ngược Thời Gian (Countdown):** Đồng hồ đếm ngược từng giây đến thời khắc tốt nghiệp (28/11/2026, 16:30 GMT+7).
   - **Xác Nhận Tham Dự (RSVP):** Biểu mẫu xác nhận tên, số người tham dự, lời chúc gửi tới tân cử nhân; lưu trữ phản hồi cục bộ trong `localStorage` và bắn pháo hoa khi gửi thành công.

5. **Cá nhân hóa người nhận qua URL:**
   - Bạn có thể gửi liên kết kèm tên người nhận tùy biến:
     - `index.html?name=Phương`
     - `index.html?name=Thầy+Dũng`
     - `index.html?name=Cả+Nhà`

---

## 📁 Cấu Trúc Thư Mục

```text
graduation/
├── index.html        # Mã nguồn HTML5 hoàn chỉnh, chuẩn SEO & Responsive
├── css/
│   └── style.css     # Định dạng giao diện, hiệu ứng 3D phong bì, Equalizer, Polaroid
├── js/
│   └── app.js        # Logic điều khiển nhạc YouTube, đếm ngược, gallery, RSVP, confetti
├── images/           # 16 bức ảnh kỷ niệm lưu trữ cục bộ
│   ├── gallery_01_img-c1.jpg
│   ├── ...
│   └── gallery_16_hlx7mgd.jpg
└── README.md         # Hướng dẫn sử dụng & triển khai
```

---

## 🚀 Hướng Dẫn Sử Dụng & Xem Trước

### 1. Mở trực tiếp
Bạn chỉ cần nhấp đúp chuột vào file `index.html` để mở ngay trên trình duyệt Google Chrome, Cốc Cốc, Edge hoặc Safari.

### 2. Xem qua máy chủ phát triển cục bộ (Khuyên dùng)
Máy chủ HTTP cục bộ đã được thiết lập sẵn trên cổng `8080`:
👉 Truy cập: **[http://localhost:8080](http://localhost:8080)**

Hoặc khởi động lại bất kỳ lúc nào bằng lệnh:
```bash
python -m http.server 8080
```

### 3. Đưa lên mạng miễn phí (Deploy)
Bạn có thể dễ dàng đưa toàn bộ thư mục này lên các nền tảng miễn phí như:
- **GitHub Pages:** Đẩy code lên GitHub và bật Pages trong mục Settings.
- **Vercel / Netlify:** Kéo thả trực tiếp thư mục `graduation` vào trang dashboard của Netlify Drop hoặc Vercel để có ngay đường link chia sẻ cho bạn bè và thầy cô!

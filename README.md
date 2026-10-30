# 🍳 TastePulse - Nền Tảng Tổng Hợp Ẩm Thực, Công Thức Món Ngon & Quán Xá

Website chuyên sâu về **Ẩm thực & Món ngon đa nguồn**, tích hợp **Chế độ đọc tinh gọn (Recipe Reader Mode)** loại bỏ 100% quảng cáo rác, bộ nhớ đệm phân tán **Vercel Edge Caching (Read-only)** và quy trình kiểm thử tự động **GitHub Actions CI/CD**.

---

## 🌟 Tính Năng Nổi Bật

### 1. Thu Thập & Chuẩn Hóa Tin Tức Ẩm Thực Đa Nguồn (RSS & Public APIs)
- **🍳 Công thức nấu ăn (Recipes)**: Bí quyết nấu phở bò, món kho, làm bánh từ *Serious Eats*, *The Kitchn*.
- **📍 Quán xá & Địa điểm (Places)**: Địa chỉ quán ốc, quán ăn đêm, phố ẩm thực Sài Gòn, Hà Nội từ *VnExpress Ẩm Thực & Du Lịch*.
- **⭐ Đánh giá ẩm thực (Reviews)**: Trải nghiệm ẩm thực fine dining, tasting menu Michelin từ *Bon Appétit*, *Food52*.
- **☕ Đồ uống & Cà phê (Drinks)**: Cà phê muối xứ Huế, Specialty Coffee, trà trái cây và nghệ thuật pha chế.
- **🥗 Ăn sạch & Dinh dưỡng (Healthy & Eat Clean)**: Thực đơn giảm cân khoa học, ăn chay thanh đạm từ *VnExpress Sức Khỏe & Dinh Dưỡng*.
- **🍲 Tinh hoa Ẩm thực Việt Nam**: Di sản Bánh mì, Phở, Bún chả và đặc sản ba miền.
- **Bộ parser RSS/Atom chuyên biệt**: Viết bằng TypeScript thuần kết hợp `fast-xml-parser`, chịu tải cao, timeout an toàn, tự động lọc bài trùng và cập nhật bài mới nhất.

### 2. Chế Độ Đọc Tinh Gọn Khi Nấu Ăn (Recipe Reader Mode)
- Trích xuất nội dung món ăn, **loại bỏ 100% banner quảng cáo, popup và sidebar vướng víu**.
- Làm nổi bật danh sách **Nguyên liệu** và **Các bước thực hiện**.
- **Tùy biến hiển thị**:
  - Chỉnh cỡ chữ linh hoạt: `A-` / `A+`.
  - Phông chữ: **Sans-serif** (dễ nhìn từ xa khi nấu ăn), **Serif** (thanh lịch), **Monospace** (gọn gàng).
  - Giao diện đọc: **Dark Mode** (tối dịu mắt), **Light Mode** (sáng rõ), **Sepia** (vàng ấm chống chói).
- **Text-to-Speech (Đọc to công thức)**: Tích hợp giọng đọc Web Speech API để vừa làm bếp vừa nghe đọc to từng bước nấu ăn mà không cần chạm tay dính dầu mỡ vào màn hình.

### 3. Lọc Theo Danh Mục & Tìm Kiếm Tức Thì
- Thanh tìm kiếm thời gian thực với gợi ý món hot: `#PhởBò`, `#BánhMì`, `#CàPhêMuối`, `#ỐcSàiGòn`, `#EatClean`...
- Lọc theo từng trang ẩm thực chuyên biệt.
- 3 chế độ xem: **Dạng lưới (Grid)**, **Dạng tạp chí (Magazine)**, **Dạng danh sách gọn (Compact)**.
- **Lưu công thức yêu thích (Bookmark)**: Lưu trực tiếp trên trình duyệt bằng LocalStorage (không cần tạo tài khoản hay đăng nhập phiền phức).

### 4. Tối Ưu Hiệu Năng Vercel Edge & Không Cần Cài Đặt Database
- Chạy ở chế độ **Read-Only**: Tận dụng cơ chế `stale-while-revalidate` và `Cache-Control` tại tầng Edge CDN của Vercel.
- Tốc độ tải trang cực nhanh, phản hồi API `< 50ms`.
- Tùy chọn Supabase: Module `lib/supabase.ts` sẵn sàng để kết nối nếu người dùng muốn đồng bộ dữ liệu đám mây trong tương lai.

---

## 🚀 HƯỚNG DẪN TRIỂN KHAI HOÀN TOÀN QUA GOOGLE CHROME (KHÔNG CẦN TẢI APP)

Bạn không cần cài đặt Node.js, Git hay bất kỳ phần mềm lập trình nào về máy. Mọi thao tác thực hiện trực tiếp trên trình duyệt Google Chrome:

### Bước 1: Tạo Repository Trên GitHub (Bằng Google Chrome)
1. Mở trình duyệt Chrome và truy cập: [https://github.com](https://github.com) (Đăng ký/Đăng nhập tài khoản).
2. Nhấn vào dấu **`+`** ở góc trên bên phải > Chọn **New repository**.
3. Điền tên Repository (ví dụ: `food-news`), chọn **Public**.
4. Nhấn **Create repository**.

### Bước 2: Tải Toàn Bộ Thư Mục Lên GitHub
1. Tại trang Repository vừa tạo trên GitHub, nhấn vào đường link **"uploading an existing file"**.
2. Kéo thả toàn bộ các file và thư mục trong thư mục này (`app`, `components`, `lib`, `public`, `.github`, `package.json`, `vercel.json`...) vào khung tải lên của GitHub.
3. Đợi các file tải lên xong > Nhấn **Commit changes**.
   > *Hệ thống GitHub Actions sẽ tự động kích hoạt workflow kiểm tra code (`CI - Code Quality & Build Validation`) ngay lập tức!*

### Bước 3: Đưa Lên Mạng Với Vercel (1 Click Deploy)
1. Mở tab mới trên Chrome và truy cập: [https://vercel.com](https://vercel.com).
2. Chọn **Sign Up** (hoặc Log In) bằng **Continue with GitHub**.
3. Tại trang tổng quan (Dashboard), nhấn **Add New...** > Chọn **Project**.
4. Bạn sẽ thấy repository `food-news` vừa tạo xuất hiện trong danh sách > Nhấn nút **Import**.
5. Giữ nguyên toàn bộ cấu hình mặc định (Next.js Framework Preset) > Nhấn nút **Deploy**.
6. Đợi khoảng 1 phút, Vercel sẽ cung cấp cho bạn một đường link website miễn phí trọn đời (ví dụ: `https://food-news-xyz.vercel.app`)!

---

## 🛠️ Cấu Trúc Mã Nguồn

```text
food news/
├── .github/
│   └── workflows/
│       └── ci.yml             # Tự động test & kiểm tra hợp lệ khi push lên nhánh main
├── app/
│   ├── api/
│   │   ├── news/route.ts      # API tổng hợp & phân tích RSS/XML món ăn đa nguồn
│   │   └── reader/route.ts    # API trích xuất bài viết tinh gọn (Recipe Reader Mode)
│   ├── bookmarks/page.tsx     # Trang xem và quản lý công thức & quán đã lưu
│   ├── reader/page.tsx        # Trang đọc công thức toàn màn hình
│   ├── globals.css            # Thiết lập Tailwind, Dark/Light/Sepia themes
│   ├── layout.tsx             # Root Layout và thẻ SEO Metadata ẩm thực
│   └── page.tsx               # Trang chủ chính với bộ lọc ẩm thực & tìm kiếm
├── components/
│   ├── ArticleCard.tsx        # Thẻ hiển thị món ăn (độ khó, thời gian nấu, ảnh bìa)
│   ├── CategoryNav.tsx        # Thanh điều hướng danh mục món ngon
│   ├── Footer.tsx             # Chân trang và thông tin nguồn ẩm thực
│   ├── Header.tsx             # Đầu trang, nút tìm kiếm, đổi giao diện, dấu trang
│   ├── ReaderModal.tsx        # Hộp thoại đọc công thức tinh gọn + Text to Speech
│   ├── SearchBar.tsx          # Thanh tìm kiếm thời gian thực món hot
│   ├── SourceFilter.tsx       # Bộ lọc nguồn tin tức ẩm thực
│   └── ViewSwitcher.tsx       # Bộ chuyển đổi giao diện hiển thị (Grid/Magazine/Compact)
├── lib/
│   ├── cache.ts               # Bộ nhớ đệm phân tầng
│   ├── feeds-config.ts        # Danh sách nguồn tin ẩm thực uy tín & danh mục
│   ├── reader-extractor.ts    # Thuật toán bóc tách công thức & loại bỏ quảng cáo
│   ├── rss-parser.ts          # Bộ phân tích XML/RSS/Atom tốc độ cao
│   ├── supabase.ts            # Tùy chọn kết nối Supabase (Read-only an toàn)
│   ├── types.ts               # TypeScript Interfaces định nghĩa chuẩn dữ liệu ẩm thực
│   └── utils.ts               # Tiện ích định dạng thời gian và nội dung
├── package.json               # Cấu hình thư viện Next.js, Tailwind, React
├── tailwind.config.ts         # Cấu hình giao diện và màu sắc
└── vercel.json                # Cấu hình Edge Caching và CDN Headers
```

---

## 🧪 Tự Động Hóa Với GitHub Actions
File workflow tại `.github/workflows/ci.yml` sẽ tự động chạy mỗi khi có code mới được tải lên nhánh `main`:
1. Khởi tạo môi trường ảo Ubuntu với Node.js 20.
2. Kiểm tra tính toàn vẹn của mã nguồn (`npm ci`).
3. Chạy kiểm tra quy chuẩn mã nguồn (`npm run lint`).
4. Biên dịch thử nghiệm (`npm run build`).
5. Nếu đạt tất cả điều kiện, Vercel sẽ tự động cập nhật bản build mới nhất lên website trực tiếp!

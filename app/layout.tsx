import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TastePulse - Cổng Thông Tin Ẩm Thực, Công Thức Món Ngon & Quán Xá',
  description: 'Nền tảng tổng hợp tin tức và bài viết chuyên sâu về ẩm thực: công thức nấu ăn, review quán xá, cà phê & đồ uống, thực đơn Eat Clean với Chế độ đọc tinh gọn (Reader Mode) và Vercel Edge Caching.',
  keywords: ['ẩm thực', 'công thức nấu ăn', 'quán ngon', 'cà phê', 'đánh giá ẩm thực', 'eat clean', 'reader mode', 'tastepulse'],
  openGraph: {
    title: 'TastePulse - Cổng Thông Tin Ẩm Thực & Món Ngon Chuyên Sâu',
    description: 'Chế độ đọc tinh gọn loại bỏ quảng cáo, tổng hợp công thức chuẩn vị và địa điểm ăn uống uy tín.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

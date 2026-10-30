'use client';

import React from 'react';
import { ChefHat, ShieldCheck, Zap, UtensilsCrossed } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border/80 bg-card/40 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-red-500 flex items-center justify-center text-white">
                <ChefHat className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg">TastePulse</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Cổng thông tin ẩm thực đa chiều: Tổng hợp công thức nấu ăn gia đình, review quán xá đường phố, văn hóa cà phê và chế độ ăn sạch Eat Clean từ các nguồn ẩm thực uy tín.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Vercel Edge Cache
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Chế độ đọc tinh gọn (Reader Mode)
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-sm mb-3">Chuyên mục ẩm thực</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Công thức nấu ăn &amp; Làm bánh</li>
              <li>Quán xá &amp; Ẩm thực đường phố</li>
              <li>Đánh giá &amp; Trải nghiệm (Reviews)</li>
              <li>Đồ uống &amp; Cà phê Specialty</li>
              <li>Ăn sạch &amp; Dinh dưỡng Eat Clean</li>
            </ul>
          </div>

          {/* Sources */}
          <div>
            <h4 className="font-bold text-sm mb-3">Nguồn tin uy tín</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>VnExpress Ẩm Thực &amp; Du Lịch</li>
              <li>Serious Eats &amp; The Kitchn</li>
              <li>Bon Appétit &amp; Food52</li>
              <li>VnExpress Dinh Dưỡng Sức Khỏe</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} TastePulse Food News. Thiết kế tối ưu cho Vercel Edge &amp; GitHub Actions.</p>
          <div className="flex items-center gap-4">
            <span>Read-only Edge Architecture</span>
            <span>·</span>
            <span>Không quảng cáo rác</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

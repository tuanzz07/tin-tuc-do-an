'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UtensilsCrossed, 
  Bookmark, 
  Search, 
  Sparkles, 
  Moon, 
  Sun, 
  RefreshCw,
  ChefHat
} from 'lucide-react';

interface HeaderProps {
  onSearchFocus?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSearchFocus, onRefresh, isRefreshing }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || 
                   localStorage.getItem('theme') !== 'light';
    if (isDark) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }

    const updateBookmarks = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('foodpulse_bookmarks') || '[]');
        setBookmarkCount(saved.length);
      } catch {
        setBookmarkCount(0);
      }
    };

    updateBookmarks();
    window.addEventListener('storage', updateBookmarks);
    window.addEventListener('bookmarks-changed', updateBookmarks);

    return () => {
      window.removeEventListener('storage', updateBookmarks);
      window.removeEventListener('bookmarks-changed', updateBookmarks);
    };
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/85 border-b border-border/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-red-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text">
                    Taste<span className="text-orange-500">Pulse</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 hidden sm:inline-block">
                    ẨM THỰC 24/7
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground hidden sm:block">
                  Công thức món ngon, Quán xá &amp; Đánh giá ẩm thực
                </p>
              </div>
            </Link>
          </div>

          {/* Center search trigger */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={onSearchFocus}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-2xl bg-muted/50 hover:bg-muted text-muted-foreground text-sm border border-border/60 transition-all hover:border-orange-500/40 group"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 group-hover:text-orange-500 transition-colors" />
                <span>Tìm món ăn, công thức, quán ngon...</span>
              </span>
              <kbd className="text-[10px] bg-background/80 px-2 py-0.5 rounded border border-border/80 text-muted-foreground">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                title="Làm mới tin ẩm thực"
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
              </button>
            )}

            {/* Bookmarks */}
            <Link
              href="/bookmarks"
              className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors flex items-center gap-1.5"
              title="Công thức & quán đã lưu"
            >
              <Bookmark className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">Món đã lưu</span>
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-[10px] font-bold bg-orange-500 text-white rounded-full flex items-center justify-center px-1 shadow-sm">
                  {bookmarkCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
              title={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-orange-500" />}
            </button>

            {/* Edge Cache Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 pl-2 text-xs text-muted-foreground border-l border-border/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Edge Cached</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

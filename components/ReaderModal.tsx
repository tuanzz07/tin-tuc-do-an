'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Article, ReaderArticle } from '@/lib/types';
import { 
  X, 
  ExternalLink, 
  Bookmark, 
  Volume2, 
  Pause, 
  Play, 
  Share2, 
  Check, 
  Clock, 
  User, 
  Sun,
  Moon,
  ChefHat,
  BookOpen
} from 'lucide-react';

interface ReaderModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({ article, onClose }) => {
  const [readerData, setReaderData] = useState<ReaderArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [readerTheme, setReaderTheme] = useState<'dark' | 'light' | 'sepia'>('dark');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!article) return;
    try {
      const saved = JSON.parse(localStorage.getItem('foodpulse_bookmarks') || '[]');
      setIsBookmarked(saved.some((item: Article) => item.id === article.id));
    } catch {
      setIsBookmarked(false);
    }
  }, [article]);

  useEffect(() => {
    if (!article) {
      setReaderData(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchReaderData = async () => {
      try {
        const query = new URLSearchParams({
          url: article.link,
          title: article.title,
          summary: article.summary
        });

        const res = await fetch(`/api/reader?${query.toString()}`);
        if (!res.ok) throw new Error('Reader API returned error');

        const data: ReaderArticle = await res.json();
        if (isMounted) {
          setReaderData(data);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Reader API error, constructing fallback:', err);
        if (isMounted) {
          setReaderData({
            id: `fallback-${article.id}`,
            title: article.title,
            author: article.author || article.source.name,
            publishedDate: article.pubDate,
            siteName: article.source.name,
            originalUrl: article.link,
            leadImage: article.coverImage,
            summary: article.summary,
            readingTime: article.readingTime,
            contentHtml: `
              <div class="space-y-4">
                <p class="reader-paragraph text-lg leading-relaxed">${article.summary}</p>
                <div class="my-6 p-6 rounded-3xl bg-muted/40 border border-border">
                  <h4 class="font-bold text-base mb-2">Xem trọn vẹn công thức từ nguồn gốc</h4>
                  <p class="text-sm text-muted-foreground mb-4">Bài viết ẩm thực này từ nguồn ${article.source.name}. Bạn có thể mở trực tiếp trang gốc để xem chi tiết video, định lượng nguyên liệu và bình luận từ độc giả.</p>
                  <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                    Xem tại ${article.source.name}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                </div>
              </div>
            `,
            textWordCount: 150
          });
          setLoading(false);
        }
      }
    };

    fetchReaderData();

    return () => {
      isMounted = false;
      stopSpeech();
    };
  }, [article]);

  const toggleBookmark = () => {
    if (!article) return;
    try {
      const saved = JSON.parse(localStorage.getItem('foodpulse_bookmarks') || '[]');
      let updated: Article[];

      if (isBookmarked) {
        updated = saved.filter((item: Article) => item.id !== article.id);
        setIsBookmarked(false);
      } else {
        updated = [article, ...saved];
        setIsBookmarked(true);
      }

      localStorage.setItem('foodpulse_bookmarks', JSON.stringify(updated));
      window.dispatchEvent(new Event('bookmarks-changed'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    if (!article) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          url: article.link
        });
      } else {
        await navigator.clipboard.writeText(article.link);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {}
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản (Web Speech API).');
      return;
    }

    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    stopSpeech();

    const plainTextToRead = (readerData?.title || '') + '. ' + 
      (readerData?.summary || '') + '. ' + 
      (readerData?.contentHtml.replace(/<[^>]+>/g, ' ') || '');

    const utterance = new SpeechSynthesisUtterance(plainTextToRead.slice(0, 3000));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    if (article?.source.language === 'vi') {
      utterance.lang = 'vi-VN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  if (!article) return null;

  const fontSizes = {
    sm: 'text-sm sm:text-base leading-relaxed',
    base: 'text-base sm:text-lg leading-relaxed',
    lg: 'text-lg sm:text-xl leading-loose',
    xl: 'text-xl sm:text-2xl leading-loose'
  };

  const fontFamilies = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono'
  };

  const themeClasses = {
    dark: 'bg-zinc-950 text-zinc-100',
    light: 'bg-white text-zinc-900',
    sepia: 'bg-[#fbf0d9] text-[#433422]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-4xl h-full sm:h-[92vh] sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden border border-border/80 transition-colors ${themeClasses[readerTheme]}`}
      >
        {/* Top Toolbar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border/40 backdrop-blur bg-inherit flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500">
              <BookOpen className="w-3.5 h-3.5" /> Chế độ đọc tinh gọn
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              · Không quảng cáo
            </span>
          </div>

          {/* Preferences */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Font Family */}
            <div className="flex items-center p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border/40 text-xs font-medium">
              <button
                onClick={() => setFontFamily('sans')}
                className={`px-2 py-1 rounded-lg ${fontFamily === 'sans' ? 'bg-orange-500 text-white' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Sans
              </button>
              <button
                onClick={() => setFontFamily('serif')}
                className={`px-2 py-1 rounded-lg font-serif ${fontFamily === 'serif' ? 'bg-orange-500 text-white' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily('mono')}
                className={`px-2 py-1 rounded-lg font-mono ${fontFamily === 'mono' ? 'bg-orange-500 text-white' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Mono
              </button>
            </div>

            {/* Font Size */}
            <div className="flex items-center p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border/40 text-xs font-bold">
              <button
                onClick={() => {
                  if (fontSize === 'xl') setFontSize('lg');
                  else if (fontSize === 'lg') setFontSize('base');
                  else if (fontSize === 'base') setFontSize('sm');
                }}
                disabled={fontSize === 'sm'}
                className="px-2 py-1 hover:text-orange-500 disabled:opacity-40"
                title="Giảm cỡ chữ"
              >
                A-
              </button>
              <span className="px-1 text-[11px] text-muted-foreground">|</span>
              <button
                onClick={() => {
                  if (fontSize === 'sm') setFontSize('base');
                  else if (fontSize === 'base') setFontSize('lg');
                  else if (fontSize === 'lg') setFontSize('xl');
                }}
                disabled={fontSize === 'xl'}
                className="px-2 py-1 hover:text-orange-500 disabled:opacity-40"
                title="Tăng cỡ chữ"
              >
                A+
              </button>
            </div>

            {/* Theme switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border/40 text-xs">
              <button
                onClick={() => setReaderTheme('light')}
                className={`p-1.5 rounded-lg ${readerTheme === 'light' ? 'bg-white text-zinc-900 shadow-sm' : 'text-muted-foreground'}`}
                title="Giao diện sáng"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`px-2 py-1 rounded-lg font-medium ${readerTheme === 'sepia' ? 'bg-[#e5d5b7] text-[#433422] shadow-sm' : 'text-muted-foreground'}`}
                title="Giao diện Sepia (chống mỏi mắt)"
              >
                Sepia
              </button>
              <button
                onClick={() => setReaderTheme('dark')}
                className={`p-1.5 rounded-lg ${readerTheme === 'dark' ? 'bg-zinc-800 text-white shadow-sm' : 'text-muted-foreground'}`}
                title="Giao diện tối"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speech */}
            <button
              onClick={handleToggleSpeech}
              title={isSpeaking ? (isPaused ? 'Tiếp tục đọc' : 'Tạm dừng đọc') : 'Nghe đọc bài/công thức'}
              className={`p-2 rounded-xl border border-border/50 transition-colors ${
                isSpeaking 
                  ? 'bg-orange-500 text-white animate-pulse' 
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
              }`}
            >
              {isSpeaking ? (
                isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Bookmark */}
            <button
              onClick={toggleBookmark}
              title={isBookmarked ? 'Bỏ lưu' : 'Lưu công thức'}
              className={`p-2 rounded-xl border border-border/50 transition-colors ${
                isBookmarked 
                  ? 'text-orange-500 bg-orange-500/10' 
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-orange-500' : ''}`} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              title="Sao chép / Chia sẻ"
              className="p-2 rounded-xl border border-border/50 text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Đóng (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-12 md:px-20 py-8 scroll-smooth">
          {loading ? (
            <div className="max-w-2xl mx-auto py-16 space-y-6 animate-pulse">
              <div className="h-4 bg-muted/60 rounded-full w-1/4"></div>
              <div className="h-10 bg-muted/60 rounded-xl w-3/4"></div>
              <div className="h-6 bg-muted/40 rounded-lg w-full"></div>
              <div className="h-64 bg-muted/30 rounded-2xl w-full"></div>
            </div>
          ) : readerData ? (
            <article className={`max-w-2xl mx-auto ${fontFamilies[fontFamily]}`}>
              <div className="mb-6 pb-6 border-b border-border/40">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${article.source.badgeColor}`}>
                    {readerData.siteName}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {readerData.readingTime} phút đọc/nấu
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight text-foreground">
                  {readerData.title}
                </h1>

                <div className="flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-medium">{readerData.author}</span>
                  </div>

                  <a
                    href={readerData.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-orange-500 hover:underline font-semibold"
                  >
                    Xem bài viết gốc <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Cover Photo */}
              {(readerData.leadImage || article.coverImage) && (
                <div className="mb-8 rounded-3xl overflow-hidden shadow-md">
                  <img
                    src={readerData.leadImage || article.coverImage!}
                    alt={readerData.title}
                    className="w-full max-h-[460px] object-cover"
                  />
                </div>
              )}

              {/* Sanitized Recipe Body */}
              <div 
                className={`${fontSizes[fontSize]} text-inherit space-y-4 prose-reader`}
                dangerouslySetInnerHTML={{ __html: readerData.contentHtml }}
              />

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-border/50 text-center">
                <p className="text-xs text-muted-foreground mb-3">
                  Công thức và bài viết được tối ưu từ <strong>{readerData.siteName}</strong>
                </p>
                <a
                  href={readerData.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-orange-500 text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-md"
                >
                  Ghé thăm bài viết tại {readerData.siteName}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </div>
  );
};

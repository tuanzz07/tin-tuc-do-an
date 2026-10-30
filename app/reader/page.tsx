'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ReaderArticle } from '@/lib/types';
import { 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  User, 
  Volume2, 
  Pause, 
  Play, 
  Share2, 
  Check, 
  Sun, 
  Moon,
  ChefHat
} from 'lucide-react';

function ReaderContent() {
  const searchParams = useSearchParams();
  const targetUrl = searchParams.get('url');

  const [readerData, setReaderData] = useState<ReaderArticle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [readerTheme, setReaderTheme] = useState<'dark' | 'light' | 'sepia'>('dark');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!targetUrl) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/reader?url=${encodeURIComponent(targetUrl)}`)
      .then((res) => res.json())
      .then((data) => {
        setReaderData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [targetUrl]);

  const handleShare = async () => {
    if (!targetUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: readerData?.title || 'TastePulse Reader',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {}
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ Web Speech API');
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

    const textToRead = (readerData?.title || '') + '. ' + (readerData?.contentHtml.replace(/<[^>]+>/g, ' ') || '');
    const utter = new SpeechSynthesisUtterance(textToRead.slice(0, 3000));
    utter.onend = () => { setIsSpeaking(false); setIsPaused(false); };
    utter.onerror = () => { setIsSpeaking(false); setIsPaused(false); };
    window.speechSynthesis.speak(utter);
    setIsSpeaking(true);
  };

  const themeClasses = {
    dark: 'bg-zinc-950 text-zinc-100',
    light: 'bg-white text-zinc-900',
    sepia: 'bg-[#fbf0d9] text-[#433422]'
  };

  const fontFamilies = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono'
  };

  const fontSizes = {
    sm: 'text-sm sm:text-base leading-relaxed',
    base: 'text-base sm:text-lg leading-relaxed',
    lg: 'text-lg sm:text-xl leading-loose',
    xl: 'text-xl sm:text-2xl leading-loose'
  };

  if (!targetUrl) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <h2 className="text-xl font-bold mb-2">Chưa cung cấp liên kết món ăn</h2>
        <p className="text-sm text-muted-foreground mb-4">Vui lòng chọn bài viết từ trang chính để kích hoạt Reader Mode.</p>
        <Link href="/" className="px-5 py-2.5 rounded-2xl bg-orange-500 text-white text-xs font-bold">
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses[readerTheme]} transition-colors`}>
      <div className="sticky top-0 z-30 border-b border-border/40 backdrop-blur-md bg-inherit px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold hover:text-orange-500 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Về trang chủ
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border/40 text-xs">
              <button
                onClick={() => setFontFamily('sans')}
                className={`px-2 py-0.5 rounded-lg ${fontFamily === 'sans' ? 'bg-orange-500 text-white' : 'text-muted-foreground'}`}
              >
                Sans
              </button>
              <button
                onClick={() => setFontFamily('serif')}
                className={`px-2 py-0.5 rounded-lg font-serif ${fontFamily === 'serif' ? 'bg-orange-500 text-white' : 'text-muted-foreground'}`}
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily('mono')}
                className={`px-2 py-0.5 rounded-lg font-mono ${fontFamily === 'mono' ? 'bg-orange-500 text-white' : 'text-muted-foreground'}`}
              >
                Mono
              </button>
            </div>

            <div className="flex items-center p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border/40 text-xs font-bold">
              <button
                onClick={() => setFontSize(fontSize === 'xl' ? 'lg' : fontSize === 'lg' ? 'base' : 'sm')}
                className="px-2 py-0.5"
              >
                A-
              </button>
              <span>|</span>
              <button
                onClick={() => setFontSize(fontSize === 'sm' ? 'base' : fontSize === 'base' ? 'lg' : 'xl')}
                className="px-2 py-0.5"
              >
                A+
              </button>
            </div>

            <div className="flex items-center p-0.5 rounded-xl bg-black/5 dark:bg-white/5 border border-border/40 text-xs">
              <button onClick={() => setReaderTheme('light')} className={`p-1 rounded-lg ${readerTheme === 'light' ? 'bg-white text-zinc-900 shadow-sm' : ''}`}>
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setReaderTheme('sepia')} className={`px-2 py-0.5 rounded-lg ${readerTheme === 'sepia' ? 'bg-[#e5d5b7]' : ''}`}>
                Sepia
              </button>
              <button onClick={() => setReaderTheme('dark')} className={`p-1 rounded-lg ${readerTheme === 'dark' ? 'bg-zinc-800 text-white shadow-sm' : ''}`}>
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleSpeech}
              className={`p-1.5 rounded-xl border border-border/40 ${isSpeaking ? 'bg-orange-500 text-white' : ''}`}
            >
              {isSpeaking ? (isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />) : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <button onClick={handleShare} className="p-1.5 rounded-xl border border-border/40">
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-48 bg-muted rounded"></div>
            <div className="space-y-2 pt-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        ) : readerData ? (
          <article className={fontFamilies[fontFamily]}>
            <div className="mb-6 pb-6 border-b border-border/40">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-500 mb-3 inline-block">
                {readerData.siteName}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
                {readerData.title}
              </h1>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> {readerData.author}
                </span>
                <a
                  href={readerData.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-orange-500 hover:underline font-semibold"
                >
                  Nguồn gốc <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {readerData.leadImage && (
              <div className="mb-8 rounded-3xl overflow-hidden shadow">
                <img src={readerData.leadImage} alt={readerData.title} className="w-full max-h-[460px] object-cover" />
              </div>
            )}

            <div
              className={`${fontSizes[fontSize]} space-y-4 prose-reader`}
              dangerouslySetInnerHTML={{ __html: readerData.contentHtml }}
            />
          </article>
        ) : null}
      </div>
    </div>
  );
}

export default function StandaloneReaderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Đang tải Reader Mode ẩm thực...</div>}>
      <ReaderContent />
    </Suspense>
  );
}

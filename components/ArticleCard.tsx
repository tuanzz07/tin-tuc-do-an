'use client';

import React, { useState, useEffect } from 'react';
import { Article } from '@/lib/types';
import { ViewMode } from './ViewSwitcher';
import { 
  BookOpen, 
  ExternalLink, 
  Bookmark, 
  Clock, 
  User, 
  Share2, 
  Check, 
  Sparkles,
  ChefHat,
  Flame
} from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  viewMode: ViewMode;
  onOpenReader: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  viewMode,
  onOpenReader
}) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('foodpulse_bookmarks') || '[]');
      const exists = saved.some((item: Article) => item.id === article.id);
      setIsBookmarked(exists);
    } catch {
      setIsBookmarked(false);
    }
  }, [article.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      console.error('Error saving bookmark:', err);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: article.link
        });
      } else {
        await navigator.clipboard.writeText(article.link);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch {
      // User cancelled
    }
  };

  // Compact Mode
  if (viewMode === 'compact') {
    return (
      <div 
        onClick={() => onOpenReader(article)}
        className="group flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-card hover:bg-muted/40 border border-border/70 hover:border-orange-500/40 transition-all cursor-pointer"
      >
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${article.source.badgeColor}`}>
            {article.source.name}
          </span>
          <h3 className="font-semibold text-sm text-foreground group-hover:text-orange-500 transition-colors truncate">
            {article.title}
          </h3>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 hidden sm:flex">
            <Clock className="w-3 h-3" />
            {article.formattedDate}
          </span>

          <button
            onClick={toggleBookmark}
            title={isBookmarked ? 'Bỏ lưu' : 'Lưu công thức'}
            className={`p-1.5 rounded-xl transition-colors ${
              isBookmarked ? 'text-orange-500 bg-orange-500/10' : 'hover:bg-muted hover:text-foreground'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-orange-500' : ''}`} />
          </button>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Mở bài gốc"
            className="p-1.5 rounded-xl hover:bg-muted hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Magazine Mode
  if (viewMode === 'magazine') {
    return (
      <div 
        onClick={() => onOpenReader(article)}
        className="group relative flex flex-col md:flex-row gap-5 p-5 rounded-3xl bg-card hover:bg-card/90 border border-border/80 hover:border-orange-500/40 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
      >
        {/* Cover Photo */}
        {article.coverImage && !imageError ? (
          <div className="relative w-full md:w-72 h-52 md:h-auto flex-shrink-0 rounded-2xl overflow-hidden bg-muted">
            <img
              src={article.coverImage}
              alt={article.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {article.difficulty && (
              <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur text-white">
                {article.difficulty}
              </span>
            )}
          </div>
        ) : (
          <div className="w-full md:w-72 h-44 md:h-auto flex-shrink-0 rounded-2xl bg-gradient-to-br from-orange-500/10 via-muted to-card border border-border/50 flex flex-col items-center justify-center p-4 text-center">
            <ChefHat className="w-8 h-8 text-orange-500/50 mb-2" />
            <span className="text-xs text-muted-foreground font-semibold">{article.categoryName}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${article.source.badgeColor}`}>
                {article.source.name}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.formattedDate}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{article.readingTime} phút đọc/nấu</span>
              {article.prepTime && (
                <>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-orange-500 font-medium">Chuẩn bị: {article.prepTime}</span>
                </>
              )}
            </div>

            <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-orange-500 transition-colors tracking-tight line-clamp-2 mb-2">
              {article.title}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
              {article.summary}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/60">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              <span>{article.author}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReader(article);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white text-xs font-bold transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Đọc tinh gọn</span>
              </button>

              <button
                onClick={toggleBookmark}
                title={isBookmarked ? 'Bỏ lưu' : 'Lưu công thức'}
                className={`p-2 rounded-xl transition-colors ${
                  isBookmarked ? 'text-orange-500 bg-orange-500/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-orange-500' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                title="Chia sẻ món ăn"
                className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>

              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="Mở liên kết gốc"
                className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid Mode (Default)
  return (
    <div 
      onClick={() => onOpenReader(article)}
      className="group relative flex flex-col justify-between rounded-3xl bg-card hover:bg-card/90 border border-border/80 hover:border-orange-500/40 hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <div>
        {/* Cover Image Container */}
        <div className="relative w-full h-52 bg-muted overflow-hidden">
          {article.coverImage && !imageError ? (
            <img
              src={article.coverImage}
              alt={article.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-500/10 via-background to-muted/80 flex flex-col items-center justify-center p-4 text-center">
              <ChefHat className="w-9 h-9 text-orange-500/50 mb-2" />
              <span className="text-xs text-muted-foreground font-semibold">{article.categoryName}</span>
            </div>
          )}

          {/* Source Tag Badge */}
          <div className="absolute top-3 left-3">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md bg-background/85 shadow-sm ${article.source.badgeColor}`}>
              {article.source.name}
            </span>
          </div>

          {/* Reader Mode Overlay Indicator */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-orange-500 text-white shadow-md">
              <BookOpen className="w-3 h-3" /> Reader Mode
            </span>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.formattedDate}
            </span>
            <span>·</span>
            <span>{article.readingTime} phút đọc</span>
            {article.difficulty && (
              <>
                <span>·</span>
                <span className="text-orange-500 font-medium">{article.difficulty}</span>
              </>
            )}
          </div>

          <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-orange-500 transition-colors tracking-tight line-clamp-2 mb-2">
            {article.title}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
            {article.summary}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-5 pt-3 border-t border-border/50 flex items-center justify-between">
        <span className="text-xs text-muted-foreground truncate max-w-[130px] font-medium">
          {article.author}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleBookmark}
            title={isBookmarked ? 'Bỏ lưu' : 'Lưu công thức'}
            className={`p-1.5 rounded-xl transition-colors ${
              isBookmarked ? 'text-orange-500 bg-orange-500/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-orange-500' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            title="Chia sẻ"
            className="p-1.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Nguồn gốc"
            className="p-1.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from '@/components/Header';
import { CategoryNav } from '@/components/CategoryNav';
import { SearchBar } from '@/components/SearchBar';
import { SourceFilter } from '@/components/SourceFilter';
import { ViewSwitcher, ViewMode } from '@/components/ViewSwitcher';
import { ArticleCard } from '@/components/ArticleCard';
import { ReaderModal } from '@/components/ReaderModal';
import { Footer } from '@/components/Footer';
import { Article, NewsResponse, FoodCategory } from '@/lib/types';
import { FALLBACK_ARTICLES } from '@/lib/feeds-config';
import { Sparkles, AlertCircle, ChefHat, UtensilsCrossed } from 'lucide-react';

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>(FALLBACK_ARTICLES);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<FoodCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [sourcesList, setSourcesList] = useState<{ id: string; name: string; count: number }[]>([]);
  const [activeReaderArticle, setActiveReaderArticle] = useState<Article | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchNews = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(`/api/news?category=all&limit=60`);
      if (!res.ok) throw new Error('Failed to load feed data');

      const data: NewsResponse = await res.json();
      if (data && Array.isArray(data.articles) && data.articles.length > 0) {
        setArticles(data.articles);

        const catMap: Record<string, number> = { all: data.total };
        data.categories?.forEach((c) => {
          catMap[c.id] = c.count;
        });
        setCategoryCounts(catMap);

        if (data.sources) {
          setSourcesList(data.sources);
        }
      }
    } catch (err) {
      console.warn('Could not fetch latest food feeds, using pre-cached fallback:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      if (activeCategory !== 'all' && article.category !== activeCategory) {
        return false;
      }

      if (selectedSource && article.source.id !== selectedSource) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesSummary = article.summary.toLowerCase().includes(query);
        const matchesAuthor = article.author.toLowerCase().includes(query);
        const matchesSource = article.source.name.toLowerCase().includes(query);
        const matchesTags = article.tags?.some((t) => t.toLowerCase().includes(query));

        if (!matchesTitle && !matchesSummary && !matchesAuthor && !matchesSource && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [articles, activeCategory, selectedSource, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        onSearchFocus={() => searchInputRef.current?.focus()}
        onRefresh={() => fetchNews(true)}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Culinary Hero Banner */}
        <div className="relative mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-card via-card/90 to-orange-500/10 border border-border/70 overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Khám phá tinh hoa ẩm thực 24/7 từ các chuyên trang uy tín</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Công Thức Món Ngon, Quán Xá &amp; Đánh Giá Ẩm Thực
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Tổng hợp công thức nấu ăn, địa điểm ăn uống trứ danh, văn hóa cà phê và thực đơn dinh dưỡng Eat Clean từ VnExpress Ẩm Thực, Serious Eats, Bon Appétit... Trải nghiệm đọc <strong>Reader Mode</strong> loại bỏ 100% quảng cáo và tối ưu tốc độ với <strong>Vercel Edge Caching</strong>.
            </p>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="space-y-4 mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            inputRef={searchInputRef}
          />

          <CategoryNav
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setSelectedSource(null);
            }}
            categoryCounts={categoryCounts}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/50">
            <div className="flex items-center gap-4 flex-wrap">
              <SourceFilter
                sources={sourcesList}
                selectedSource={selectedSource}
                onSelectSource={setSelectedSource}
              />

              <div className="text-xs text-muted-foreground">
                Hiển thị <strong>{filteredArticles.length}</strong> bài viết ẩm thực
                {searchQuery && ` phù hợp với "${searchQuery}"`}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <ViewSwitcher mode={viewMode} onChange={setViewMode} />
            </div>
          </div>
        </div>

        {/* Article Grid / Magazine / Compact */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl border border-border/70 p-4 space-y-3 bg-card animate-pulse">
                <div className="h-48 bg-muted rounded-2xl w-full"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : viewMode === 'magazine'
                ? 'space-y-6'
                : 'space-y-2.5'
            }
          >
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                viewMode={viewMode}
                onOpenReader={(item) => setActiveReaderArticle(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-card border border-border/70 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg">Không tìm thấy món ăn nào</h3>
            <p className="text-sm text-muted-foreground">
              Không có bài viết nào khớp với từ khóa &quot;{searchQuery || activeCategory}&quot;. Hãy thử tìm tên món ăn khác như Phở bò, Bánh mì, hoặc bấm xem tất cả danh mục.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedSource(null);
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-2xl bg-orange-500 text-white text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Xem tất cả món ngon
            </button>
          </div>
        )}
      </main>

      {/* Reader Mode Full Modal */}
      {activeReaderArticle && (
        <ReaderModal
          article={activeReaderArticle}
          onClose={() => setActiveReaderArticle(null)}
        />
      )}

      <Footer />
    </div>
  );
}

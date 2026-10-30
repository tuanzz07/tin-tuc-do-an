import { NextRequest, NextResponse } from 'next/server';
import { FEED_SOURCES, FALLBACK_ARTICLES } from '@/lib/feeds-config';
import { parseFeed } from '@/lib/rss-parser';
import { Article, NewsResponse, FoodCategory } from '@/lib/types';
import { getCachedData, setCachedData } from '@/lib/cache';

export const revalidate = 300; // 5 minutes ISR cache

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryParam = (searchParams.get('category') || 'all') as FoodCategory;
  const searchParam = (searchParams.get('q') || searchParams.get('search') || '').toLowerCase().trim();
  const sourceParam = searchParams.get('source');
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const limitParam = parseInt(searchParams.get('limit') || '30', 10);

  const cacheKey = `food_news_all_v1`;
  let allArticles: Article[] | null = getCachedData<Article[]>(cacheKey, 5 * 60 * 1000);

  if (!allArticles) {
    try {
      const feedPromises = FEED_SOURCES.map((source) => parseFeed(source, 6000));
      const results = await Promise.allSettled(feedPromises);

      const collected: Article[] = [];
      results.forEach((res) => {
        if (res.status === 'fulfilled' && Array.isArray(res.value)) {
          collected.push(...res.value);
        }
      });

      const combined = [...collected, ...FALLBACK_ARTICLES];

      // Deduplicate articles by title and link
      const seen = new Set<string>();
      allArticles = combined.filter((article) => {
        const uniqueKey = (article.link || article.title).toLowerCase().trim();
        if (seen.has(uniqueKey)) return false;
        seen.add(uniqueKey);
        return true;
      });

      // Sort newest first
      allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

      setCachedData(cacheKey, allArticles);
    } catch (err) {
      console.error('Error fetching culinary RSS feeds, using fallback:', err);
      allArticles = FALLBACK_ARTICLES;
    }
  }

  // Filter by category
  let filtered = allArticles;
  if (categoryParam && categoryParam !== 'all') {
    filtered = filtered.filter((item) => item.category === categoryParam);
  }

  // Filter by source
  if (sourceParam) {
    filtered = filtered.filter((item) => item.source.id === sourceParam);
  }

  // Filter by search query
  if (searchParam) {
    filtered = filtered.filter((item) => 
      item.title.toLowerCase().includes(searchParam) ||
      item.summary.toLowerCase().includes(searchParam) ||
      item.author.toLowerCase().includes(searchParam) ||
      item.source.name.toLowerCase().includes(searchParam) ||
      item.tags?.some((t) => t.toLowerCase().includes(searchParam))
    );
  }

  // Calculate category statistics
  const categoriesMap: Record<string, number> = {};
  allArticles.forEach((art) => {
    categoriesMap[art.category] = (categoriesMap[art.category] || 0) + 1;
  });

  const categoryStats = Object.keys(categoriesMap).map((cat) => ({
    id: cat as FoodCategory,
    count: categoriesMap[cat]
  }));

  // Calculate source statistics
  const sourcesMap: Record<string, { name: string; count: number }> = {};
  allArticles.forEach((art) => {
    if (!sourcesMap[art.source.id]) {
      sourcesMap[art.source.id] = { name: art.source.name, count: 0 };
    }
    sourcesMap[art.source.id].count += 1;
  });

  const sourceStats = Object.keys(sourcesMap).map((id) => ({
    id,
    name: sourcesMap[id].name,
    count: sourcesMap[id].count
  }));

  // Pagination
  const startIndex = (pageParam - 1) * limitParam;
  const paginatedArticles = filtered.slice(startIndex, startIndex + limitParam);

  const responsePayload: NewsResponse = {
    articles: paginatedArticles,
    total: filtered.length,
    categories: categoryStats,
    sources: sourceStats,
    updatedAt: new Date().toISOString(),
    cached: true
  };

  return NextResponse.json(responsePayload, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'CDN-Cache-Control': 'public, s-maxage=300',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=300'
    }
  });
}

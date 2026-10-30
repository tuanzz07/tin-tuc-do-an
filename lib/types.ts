export type FoodCategory = 
  | 'all'
  | 'recipes'
  | 'places'
  | 'reviews'
  | 'drinks'
  | 'healthy'
  | 'vietnam';

export interface CategoryInfo {
  id: FoodCategory;
  name: string;
  vietnameseName: string;
  description: string;
  iconName: string;
  color: string;
}

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  feedUrl: string;
  type: 'rss' | 'atom';
  category: FoodCategory;
  badgeColor: string;
  icon: string;
  language: 'vi' | 'en';
}

export interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  formattedDate: string;
  relativeTime: string;
  source: {
    id: string;
    name: string;
    url: string;
    badgeColor: string;
    icon: string;
    language: 'vi' | 'en';
  };
  category: FoodCategory;
  categoryName: string;
  summary: string;
  coverImage: string | null;
  author: string;
  readingTime: number; // in minutes or cooking time
  tags?: string[];
  prepTime?: string;
  servings?: string;
  difficulty?: 'Dễ' | 'Trung bình' | 'Nâng cao';
}

export interface ReaderArticle {
  id: string;
  title: string;
  author: string;
  publishedDate: string;
  siteName: string;
  originalUrl: string;
  leadImage: string | null;
  summary: string;
  readingTime: number;
  contentHtml: string;
  textWordCount: number;
  ingredients?: string[];
}

export interface NewsResponse {
  articles: Article[];
  total: number;
  categories: { id: FoodCategory; count: number }[];
  sources: { id: string; name: string; count: number }[];
  updatedAt: string;
  cached: boolean;
}

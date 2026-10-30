import { XMLParser } from 'fast-xml-parser';
import { Article, FeedSource, FoodCategory } from './types';
import { cleanHtmlText, estimateReadingTime, extractImageUrlFromHtml, formatRelativeTime } from './utils';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  cdataPropName: '__cdata',
  trimValues: true,
  parseTagValue: false
});

/**
 * Fetch and parse a single RSS or Atom feed with timeout
 */
export async function parseFeed(source: FeedSource, timeoutMs = 6000): Promise<Article[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(source.feedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) TastePulse/1.0 FoodNewsAggregator',
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
      },
      next: { revalidate: 300 } // Edge / ISR cache for 5 minutes
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Feed Error] ${source.name} returned status ${response.status}`);
      return [];
    }

    const xmlText = await response.text();
    return parseXmlContent(xmlText, source);
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    console.warn(`[Feed Fetch Failed] ${source.name}:`, (err as Error)?.message || 'Timeout/Error');
    return [];
  }
}

/**
 * Parse XML string into standardized Article objects
 */
export function parseXmlContent(xmlString: string, source: FeedSource): Article[] {
  const articles: Article[] = [];

  try {
    const parsed = xmlParser.parse(xmlString);

    // 1. Check for standard RSS 2.0 (<rss><channel><item>...</item></channel></rss>)
    const channel = parsed?.rss?.channel || parsed?.rdf?.channel;
    const items = channel?.item;

    if (items) {
      const itemList = Array.isArray(items) ? items : [items];

      for (const item of itemList) {
        const article = mapRssItemToArticle(item, source);
        if (article) articles.push(article);
      }

      return articles;
    }

    // 2. Check for Atom (<feed><entry>...</entry></feed>)
    const entries = parsed?.feed?.entry;
    if (entries) {
      const entryList = Array.isArray(entries) ? entries : [entries];

      for (const entry of entryList) {
        const article = mapAtomEntryToArticle(entry, source);
        if (article) articles.push(article);
      }

      return articles;
    }

    // 3. Fallback regex parser
    return parseWithFallbackRegex(xmlString, source);
  } catch (e) {
    console.warn(`XML parsing failed for ${source.name}, trying regex fallback`, e);
    return parseWithFallbackRegex(xmlString, source);
  }
}

function getValue(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (node.__cdata) return String(node.__cdata);
  if (node['#text']) return String(node['#text']);
  return '';
}

function mapRssItemToArticle(item: any, source: FeedSource): Article | null {
  try {
    const rawTitle = getValue(item.title);
    const title = cleanHtmlText(rawTitle);
    if (!title) return null;

    let link = '';
    if (typeof item.link === 'string') {
      link = item.link;
    } else if (item.link?.['@_href']) {
      link = item.link['@_href'];
    } else if (item.link) {
      link = getValue(item.link);
    }
    if (!link && item.guid) {
      const guidVal = getValue(item.guid);
      if (guidVal.startsWith('http')) link = guidVal;
    }

    const rawPubDate = getValue(item.pubDate) || getValue(item['dc:date']) || new Date().toISOString();
    const pubDateObj = new Date(rawPubDate);
    const validPubDate = isNaN(pubDateObj.getTime()) ? new Date().toISOString() : pubDateObj.toISOString();

    const rawContent = getValue(item['content:encoded']) || getValue(item.description) || '';
    const summary = cleanHtmlText(rawContent).slice(0, 240);

    // Extract cover image
    let coverImage: string | null = null;

    if (item.enclosure?.['@_url']) {
      const encUrl = item.enclosure['@_url'];
      if (encUrl && (encUrl.includes('jpg') || encUrl.includes('png') || encUrl.includes('jpeg') || encUrl.includes('webp'))) {
        coverImage = encUrl;
      }
    }

    if (!coverImage && item['media:content']?.['@_url']) {
      coverImage = item['media:content']['@_url'];
    }
    if (!coverImage && item['media:thumbnail']?.['@_url']) {
      coverImage = item['media:thumbnail']['@_url'];
    }

    if (!coverImage && rawContent) {
      coverImage = extractImageUrlFromHtml(rawContent);
    }

    const author = cleanHtmlText(getValue(item['dc:creator']) || getValue(item.author) || source.name);
    const readingTime = estimateReadingTime(summary + ' ' + rawContent);
    const id = `${source.id}-${Buffer.from(link || title).toString('base64').slice(0, 16)}`;

    return {
      id,
      title,
      link,
      pubDate: validPubDate,
      formattedDate: formatRelativeTime(validPubDate),
      relativeTime: formatRelativeTime(validPubDate),
      source: {
        id: source.id,
        name: source.name,
        url: source.url,
        badgeColor: source.badgeColor,
        icon: source.icon,
        language: source.language
      },
      category: source.category,
      categoryName: getFoodCategoryName(source.category),
      summary: summary || title,
      coverImage,
      author: author || source.name,
      readingTime
    };
  } catch {
    return null;
  }
}

function mapAtomEntryToArticle(entry: any, source: FeedSource): Article | null {
  try {
    const rawTitle = getValue(entry.title);
    const title = cleanHtmlText(rawTitle);
    if (!title) return null;

    let link = '';
    if (Array.isArray(entry.link)) {
      const altLink = entry.link.find((l: any) => l['@_rel'] === 'alternate' || !l['@_rel']);
      link = altLink?.['@_href'] || entry.link[0]?.['@_href'] || '';
    } else if (entry.link?.['@_href']) {
      link = entry.link['@_href'];
    } else {
      link = getValue(entry.link);
    }

    const rawPubDate = getValue(entry.published) || getValue(entry.updated) || new Date().toISOString();
    const pubDateObj = new Date(rawPubDate);
    const validPubDate = isNaN(pubDateObj.getTime()) ? new Date().toISOString() : pubDateObj.toISOString();

    const rawContent = getValue(entry.content) || getValue(entry.summary) || '';
    const summary = cleanHtmlText(rawContent).slice(0, 240);

    let coverImage = extractImageUrlFromHtml(rawContent);
    if (!coverImage && entry['media:thumbnail']?.['@_url']) {
      coverImage = entry['media:thumbnail']['@_url'];
    }

    const author = cleanHtmlText(getValue(entry.author?.name) || getValue(entry.author) || source.name);
    const readingTime = estimateReadingTime(summary + ' ' + rawContent);
    const id = `${source.id}-${Buffer.from(link || title).toString('base64').slice(0, 16)}`;

    return {
      id,
      title,
      link,
      pubDate: validPubDate,
      formattedDate: formatRelativeTime(validPubDate),
      relativeTime: formatRelativeTime(validPubDate),
      source: {
        id: source.id,
        name: source.name,
        url: source.url,
        badgeColor: source.badgeColor,
        icon: source.icon,
        language: source.language
      },
      category: source.category,
      categoryName: getFoodCategoryName(source.category),
      summary: summary || title,
      coverImage,
      author: author || source.name,
      readingTime
    };
  } catch {
    return null;
  }
}

function parseWithFallbackRegex(xml: string, source: FeedSource): Article[] {
  const articles: Article[] = [];
  const itemRegex = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];
    const titleMatch = itemContent.match(/<title[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/title>/i);
    const title = cleanHtmlText(titleMatch ? (titleMatch[1] || titleMatch[2]) : '');
    if (!title) continue;

    const linkMatch = itemContent.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>|<link[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/link>/i);
    const link = linkMatch ? (linkMatch[1] || linkMatch[2] || linkMatch[3] || '').trim() : '';

    const dateMatch = itemContent.match(/<(?:pubDate|published|updated|dc:date)[^>]*>([\s\S]*?)<\/(?:pubDate|published|updated|dc:date)>/i);
    const pubDate = dateMatch ? new Date(dateMatch[1].trim()).toISOString() : new Date().toISOString();

    const descMatch = itemContent.match(/<(?:description|content|summary)[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/(?:description|content|summary)>/i);
    const rawDesc = descMatch ? (descMatch[1] || descMatch[2] || '') : '';
    const summary = cleanHtmlText(rawDesc).slice(0, 240);
    const coverImage = extractImageUrlFromHtml(rawDesc);

    const id = `${source.id}-${Buffer.from(link || title).toString('base64').slice(0, 16)}`;

    articles.push({
      id,
      title,
      link,
      pubDate,
      formattedDate: formatRelativeTime(pubDate),
      relativeTime: formatRelativeTime(pubDate),
      source: {
        id: source.id,
        name: source.name,
        url: source.url,
        badgeColor: source.badgeColor,
        icon: source.icon,
        language: source.language
      },
      category: source.category,
      categoryName: getFoodCategoryName(source.category),
      summary: summary || title,
      coverImage,
      author: source.name,
      readingTime: estimateReadingTime(summary)
    });
  }

  return articles;
}

function getFoodCategoryName(category: string): string {
  switch (category) {
    case 'recipes': return 'Công thức nấu ăn';
    case 'places': return 'Quán xá & Địa điểm';
    case 'reviews': return 'Đánh giá & Trải nghiệm';
    case 'drinks': return 'Đồ uống & Cà phê';
    case 'healthy': return 'Ăn sạch & Dinh dưỡng';
    case 'vietnam': return 'Ẩm thực Việt Nam';
    default: return 'Ẩm thực';
  }
}

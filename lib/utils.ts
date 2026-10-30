import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (isNaN(diffInSeconds) || diffInSeconds < 0) {
      return 'Vừa xong';
    }

    if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ngày trước`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} tháng trước`;
    }

    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Gần đây';
  }
}

export function estimateReadingTime(text: string): number {
  if (!text) return 3;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200); // 200 words per minute average
  return Math.max(1, minutes);
}

export function cleanHtmlText(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractImageUrlFromHtml(html: string): string | null {
  if (!html) return null;
  
  // Try finding <img> src
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    const src = imgMatch[1];
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
  }

  // Try finding media:thumbnail or enclosure or background-image
  const bgMatch = html.match(/url\(["']?([^"')]+)["']?\)/i);
  if (bgMatch && bgMatch[1] && (bgMatch[1].startsWith('http://') || bgMatch[1].startsWith('https://'))) {
    return bgMatch[1];
  }

  return null;
}

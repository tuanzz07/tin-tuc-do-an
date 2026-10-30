import { NextRequest, NextResponse } from 'next/server';
import { extractReadableContent } from '@/lib/reader-extractor';

export const revalidate = 86400; // 24 hours caching

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const fallbackTitle = searchParams.get('title') || undefined;
  const fallbackSummary = searchParams.get('summary') || undefined;

  if (!targetUrl) {
    return NextResponse.json(
      { error: 'Missing required parameter: url' },
      { status: 400 }
    );
  }

  try {
    const readerArticle = await extractReadableContent(targetUrl, fallbackTitle, fallbackSummary);

    return NextResponse.json(readerArticle, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        'CDN-Cache-Control': 'public, s-maxage=86400',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=86400'
      }
    });
  } catch (error) {
    console.error('Reader extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract readable article content' },
      { status: 500 }
    );
  }
}

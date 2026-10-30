/**
 * Optional Supabase client configuration
 * Not mandatory: The website operates in read-only edge caching mode by default.
 * If you configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel,
 * this can optionally be used for cloud bookmark synchronization and article telemetry.
 */

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

export interface SavedArticleRecord {
  id: string;
  article_id: string;
  user_id?: string;
  title: string;
  link: string;
  source_name: string;
  category: string;
  saved_at: string;
}

/**
 * Optional sync to Supabase (Safe fallback to localStorage when no keys are set)
 */
export async function syncBookmarkToSupabase(article: any) {
  if (!isSupabaseConfigured()) {
    return { success: false, reason: 'Supabase credentials not configured (using local browser storage)' };
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const res = await fetch(`${supabaseUrl}/rest/v1/bookmarks`, {
      method: 'POST',
      headers: {
        'apikey': anonKey!,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        article_id: article.id,
        title: article.title,
        link: article.link,
        source_name: article.source.name,
        category: article.category,
        saved_at: new Date().toISOString()
      })
    });

    return { success: res.ok };
  } catch (error) {
    console.warn('Supabase sync error (ignoring, falling back to localStorage):', error);
    return { success: false, error };
  }
}

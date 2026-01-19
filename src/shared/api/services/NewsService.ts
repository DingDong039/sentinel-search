import { firecrawl, SearchResponse } from "@/shared/lib/firecrawl";
import { News } from "@/entities/models";
import { supabase } from "@/shared/api/supabase";

export const NewsService = {
  async searchNews(query: string): Promise<News[]> {
    try {
      const results = (await firecrawl.search(query, {
        limit: 10,
        scrapeOptions: {
          formats: ["markdown"],
        },
      })) as unknown as SearchResponse;

      if (!results.data) {
        return [];
      }

      const newsItems: News[] = results.data.map((item) => {
        const metadata = item.metadata || {};
        return {
          id: crypto.randomUUID(),
          title: (metadata.title as string) || "Untitled",
          source: (metadata.sourceURL as string) || "Firecrawl News",
          url: (metadata.url as string) || (metadata.sourceURL as string) || "",
          publishedAt: (metadata.date as string) || new Date().toISOString(),
          summary:
            (metadata.description as string) ||
            (item.markdown?.slice(0, 150) as string) ||
            "",
          thumbnailUrl:
            (metadata.ogImage as string) ||
            (metadata.image as string) ||
            undefined,
        };
      });

      // Persist to Supabase
      if (newsItems.length > 0) {
        const { error } = await supabase.from("news_articles").upsert(
          newsItems.map((news) => ({
            id: news.id,
            title: news.title,
            source: news.source,
            url: news.url,
            published_at: news.publishedAt,
            summary: news.summary,
            thumbnail_url: news.thumbnailUrl,
          })),
          { onConflict: "url", ignoreDuplicates: true }, // Avoid duplicates based on URL
        );

        if (error) {
          console.error("Failed to persist news:", error);
        }
      }

      return newsItems;
    } catch (error) {
      console.error("News search failed:", error);
      // Rethrow to let the store handle error state
      throw error;
    }
  },
};

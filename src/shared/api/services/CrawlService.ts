import { firecrawl, CrawlResult, ScrapeResult } from "@/shared/lib/firecrawl";

export interface CrawlOptions {
  limit?: number;
  includePaths?: string[];
  excludePaths?: string[];
  formats?: ("markdown" | "html" | "links")[];
}

export const CrawlService = {
  /**
   * Crawl an entire website starting from a URL
   * Returns data for all discovered pages
   */
  async crawlWebsite(
    url: string,
    options: CrawlOptions = {},
  ): Promise<CrawlResult | null> {
    try {
      // SDK crawl returns CrawlJob with data array
      const crawlResponse = await firecrawl.crawl(url, {
        limit: options.limit || 10, // Default to 10 pages to conserve credits
        includePaths: options.includePaths,
        excludePaths: options.excludePaths,
        scrapeOptions: {
          formats: options.formats || ["markdown"],
        },
      });

      // Map Document[] to ScrapeResult[]
      const data: ScrapeResult[] =
        crawlResponse.data?.map((doc) => ({
          markdown: doc.markdown,
          html: doc.html,
          links: doc.links,
          metadata: doc.metadata,
        })) || [];

      return {
        success: true,
        status: "completed",
        total: data.length,
        completed: data.length,
        data,
      };
    } catch (error) {
      console.error("Crawl error:", error);
      return null;
    }
  },
};

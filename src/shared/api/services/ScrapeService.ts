import { firecrawl, ScrapeResult } from "@/shared/lib/firecrawl";
import { logger } from "@/shared/lib/logger";

export interface ScrapeOptions {
  formats?: ("markdown" | "html" | "links" | "screenshot")[];
  includeTags?: string[];
  excludeTags?: string[];
  onlyMainContent?: boolean;
}

export const ScrapeService = {
  /**
   * Deep scrape a single URL with advanced options
   * Returns LLM-ready data in multiple formats
   */
  async scrapeUrl(
    url: string,
    options: ScrapeOptions = {},
  ): Promise<ScrapeResult | null> {
    try {
      // SDK returns Document type directly (not { success, data })
      const result = await firecrawl.scrape(url, {
        formats: options.formats || ["markdown"],
        includeTags: options.includeTags,
        excludeTags: options.excludeTags,
        onlyMainContent: options.onlyMainContent ?? true,
      });

      // Document type has markdown, html, etc directly
      return {
        markdown: result.markdown,
        html: result.html,
        links: result.links,
        screenshot: result.screenshot,
        metadata: result.metadata,
      };
    } catch (error) {
      logger.error("Scrape error:", error);
      return null;
    }
  },
};

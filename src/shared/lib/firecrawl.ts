import Firecrawl from "@mendable/firecrawl-js";

// Use server-side only env key (without NEXT_PUBLIC_ prefix)
// This ensures Firecrawl only runs in server actions, not client-side
const apiKey = process.env.FIRECRAWL_API_KEY;

export const firecrawl = new Firecrawl({ apiKey });

export type SearchResult = {
  markdown?: string;
  metadata?: {
    title?: string;
    description?: string;
    url?: string;
    sourceURL?: string;
    [key: string]: unknown;
  };
};

export type SearchResponse = {
  success: boolean;
  data: SearchResult[];
};

// Scrape types
export type ScrapeResult = {
  markdown?: string;
  html?: string;
  links?: string[];
  screenshot?: string;
  metadata?: {
    title?: string;
    description?: string;
    url?: string;
    sourceURL?: string;
    statusCode?: number;
    [key: string]: unknown;
  };
};

// Crawl types
export type CrawlStatus = "scraping" | "completed" | "failed";

export type CrawlResult = {
  success: boolean;
  status: CrawlStatus;
  total: number;
  completed: number;
  data: ScrapeResult[];
};

// Agent types
export type AgentResult = {
  success: boolean;
  data: unknown;
  creditsUsed?: number;
};

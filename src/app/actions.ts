"use server";

import { JobService } from "@/shared/api/services/JobService";
import { ProductService } from "@/shared/api/services/ProductService";
import { NewsService } from "@/shared/api/services/NewsService";
import {
  ScrapeService,
  ScrapeOptions,
} from "@/shared/api/services/ScrapeService";
import { CrawlService, CrawlOptions } from "@/shared/api/services/CrawlService";
import { AgentService, AgentOptions } from "@/shared/api/services/AgentService";
import { supabase } from "@/shared/api/supabase";
import { logger } from "@/shared/lib/logger";

async function logSearch(
  query: string,
  type: "job" | "product" | "news" | "scrape" | "crawl" | "agent",
) {
  try {
    await supabase.from("search_logs").insert({
      query,
      type,
      metadata: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    logger.error("Failed to log search:", error);
  }
}

// ============ SEARCH ACTIONS ============
export async function searchJobsAction(query: string) {
  logger.log("[ACTION] searchJobsAction called with:", query);
  await logSearch(query, "job");
  const jobs = await JobService.searchJobs(query);
  logger.log("[ACTION] Jobs returned:", jobs.length, "items");
  return jobs;
}

export async function searchProductsAction(query: string) {
  await logSearch(query, "product");
  return await ProductService.searchProduct(query);
}

export async function searchNewsAction(query: string) {
  await logSearch(query, "news");
  return await NewsService.searchNews(query);
}

// ============ SCRAPE ACTIONS ============
export async function scrapeUrlAction(url: string, options?: ScrapeOptions) {
  logger.log("[ACTION] scrapeUrlAction called with:", url);
  await logSearch(url, "scrape");
  return await ScrapeService.scrapeUrl(url, options);
}

export async function scrapeProductAction(url: string) {
  return await ProductService.scrapeProductDetails(url);
}

// ============ CRAWL ACTIONS ============
export async function crawlWebsiteAction(url: string, options?: CrawlOptions) {
  logger.log("[ACTION] crawlWebsiteAction called with:", url);
  await logSearch(url, "crawl");
  return await CrawlService.crawlWebsite(url, options);
}

// ============ AGENT ACTIONS ============
export async function runAgentAction(prompt: string, options?: AgentOptions) {
  logger.log("[ACTION] runAgentAction called with:", prompt);
  await logSearch(prompt, "agent");
  return await AgentService.runAgent(prompt, options);
}

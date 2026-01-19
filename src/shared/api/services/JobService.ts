import { firecrawl, SearchResponse } from "@/shared/lib/firecrawl";
import { Job } from "@/entities/models";
import { supabase } from "@/shared/api/supabase";

export const JobService = {
  async searchJobs(query: string): Promise<Job[]> {
    try {
      const results = (await firecrawl.search(query, {
        limit: 10,
        scrapeOptions: {
          formats: ["markdown"],
        },
      })) as unknown as SearchResponse;

      // Debug: Log raw response structure
      console.log("[JobService] Raw results type:", typeof results);
      console.log(
        "[JobService] Results keys:",
        results ? Object.keys(results) : "null",
      );
      console.log(
        "[JobService] Has data?:",
        !!results?.data,
        "Length:",
        results?.data?.length,
      );

      if (!results.data || results.data.length === 0) {
        console.log("[JobService] No data found, returning empty array");
        return [];
      }

      console.log("[JobService] Processing", results.data.length, "items");

      const jobs = results.data.map((item) => {
        const metadata = item.metadata || {};
        return {
          id: crypto.randomUUID(),
          title: (metadata.title as string) || "Untitled",
          url: (metadata.url as string) || (metadata.sourceURL as string) || "",
          company: "Unknown",
          location: "Remote",
          salary: undefined,
          postedAt: new Date().toISOString(),
          source: (metadata.sourceURL as string) || "Firecrawl Search",
          description:
            (metadata.description as string) ||
            (item.markdown?.slice(0, 150) as string) ||
            "",
        };
      });

      // Persist to Supabase
      if (jobs.length > 0) {
        const { error } = await supabase.from("jobs").upsert(
          jobs.map((job) => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary_range: job.salary, // Mapped from optional salary
            url: job.url,
            source: job.source,
            posted_at: job.postedAt,
          })),
          { onConflict: "url", ignoreDuplicates: true },
        );

        if (error) {
          console.error("Failed to persist jobs:", error);
        }
      }

      return jobs;
    } catch (error) {
      console.error("Job search failed:", error);
      // Rethrow to let the store handle error state
      throw error;
    }
  },
};

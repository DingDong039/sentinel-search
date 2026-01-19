import { create } from "zustand";
import { Job, Product, News } from "@/entities/models";
import {
  searchJobsAction,
  searchProductsAction,
  searchNewsAction,
} from "@/app/actions";
import { logger } from "@/shared/lib/logger";

export type SearchError = {
  type: "credits_exhausted" | "rate_limit" | "unknown";
  message: string;
} | null;

interface SearchState {
  query: string;
  jobs: Job[];
  products: Product[];
  news: News[];
  loading: boolean;
  error: SearchError;
  setQuery: (query: string) => void;
  clearError: () => void;
  performSearch: () => Promise<void>;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: "",
  jobs: [],
  products: [],
  news: [],
  loading: false,
  error: null,
  setQuery: (query) => set({ query }),
  clearError: () => set({ error: null }),
  performSearch: async () => {
    const { query } = get();
    if (!query.trim()) return;

    set({ loading: true, error: null });
    try {
      // Run searches sequentially to respect 2 concurrent request limit
      const jobs = await searchJobsAction(query);
      const products = await searchProductsAction(query);
      const news = await searchNewsAction(query);

      set({ jobs, products, news, loading: false });
    } catch (error) {
      logger.error("Search failed:", error);

      // Detect error type from message
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      let errorType: "credits_exhausted" | "rate_limit" | "unknown" = "unknown";

      if (
        errorMessage.includes("Insufficient credits") ||
        errorMessage.includes("402")
      ) {
        errorType = "credits_exhausted";
      } else if (
        errorMessage.includes("Rate limit") ||
        errorMessage.includes("429")
      ) {
        errorType = "rate_limit";
      }

      set({
        loading: false,
        error: {
          type: errorType,
          message: errorMessage,
        },
      });
    }
  },
}));

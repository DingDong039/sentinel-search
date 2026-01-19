import { firecrawl, SearchResponse } from "@/shared/lib/firecrawl";
import { Product } from "@/entities/models";
import { supabase } from "@/shared/api/supabase";

export const ProductService = {
  async searchProduct(productName: string): Promise<Product[]> {
    try {
      const results = (await firecrawl.search(`${productName} price Thailand`, {
        limit: 5,
        scrapeOptions: {
          formats: ["markdown"],
        },
      })) as unknown as SearchResponse;

      if (!results.data) {
        return [];
      }

      const products = results.data.map((item) => {
        const metadata = item.metadata || {};
        return {
          id: crypto.randomUUID(),
          title: (metadata.title as string) || "Unknown Product",
          url: (metadata.url as string) || (metadata.sourceURL as string) || "",
          currentPrice: 0,
          currency: "THB",
          description:
            (metadata.description as string) ||
            (item.markdown?.slice(0, 150) as string) ||
            "",
          imageUrl:
            (metadata.ogImage as string) ||
            (metadata.image as string) ||
            undefined,
          source: "Firecrawl Search",
        };
      });

      // Persist to Supabase
      if (products.length > 0) {
        const { error } = await supabase.from("products").upsert(
          products.map((p) => ({
            id: p.id,
            title: p.title,
            price: p.currentPrice,
            currency: p.currency,
            url: p.url,
            source: p.source,
            image_url: p.imageUrl,
          })),
          { onConflict: "url", ignoreDuplicates: true },
        );

        if (error) {
          console.error("Failed to persist products:", error);
        }
      }

      return products;
    } catch (error) {
      console.error("Product search failed:", error);
      // Rethrow to let the store handle error state
      throw error;
    }
  },

  async scrapeProductDetails(url: string): Promise<Partial<Product> | null> {
    try {
      const scrapeResult = await firecrawl.scrape(url, {
        formats: ["json"],
        jsonOptions: {
          prompt:
            "Extract product name as 'title', price as 'currentPrice' (number only), currency, and average rating as 'rating' from this page.",
        },
      });

      if (!scrapeResult) return null;

      // Safety casting based on our prompt's expected output
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const data =
        (scrapeResult as any).json ||
        (scrapeResult as any).data ||
        scrapeResult;
      /* eslint-enable @typescript-eslint/no-explicit-any */

      return {
        title: data.title,
        currentPrice: Number(data.currentPrice) || 0,
        currency: data.currency || "THB",
        rating: Number(data.rating) || 0,
      };
    } catch (error) {
      console.error("Product scrape failed:", error);
      return null;
    }
  },
};

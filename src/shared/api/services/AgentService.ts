import { firecrawl, AgentResult } from "@/shared/lib/firecrawl";
import { logger } from "@/shared/lib/logger";

export interface AgentOptions {
  urls?: string[];
  schema?: Record<string, unknown>;
}

export const AgentService = {
  /**
   * Run AI-powered data gathering agent
   * Autonomously searches and extracts structured data based on prompt
   */
  async runAgent(
    prompt: string,
    options: AgentOptions = {},
  ): Promise<AgentResult | null> {
    try {
      // Call Firecrawl Agent API
      // Note: Agent is a newer feature, check SDK support
      const response = await (
        firecrawl as unknown as {
          agent: (params: {
            prompt: string;
            urls?: string[];
            schema?: Record<string, unknown>;
          }) => Promise<{
            success: boolean;
            data: unknown;
            creditsUsed?: number;
          }>;
        }
      ).agent({
        prompt,
        urls: options.urls,
        schema: options.schema,
      });

      if (!response.success) {
        logger.error("Agent failed:", response);
        return null;
      }

      return {
        success: true,
        data: response.data,
        creditsUsed: response.creditsUsed,
      };
    } catch (error) {
      logger.error("Agent error:", error);
      // Agent might not be available in all SDK versions
      return null;
    }
  },
};

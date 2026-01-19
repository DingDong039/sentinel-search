"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Loader2, X, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { crawlWebsiteAction } from "@/app/actions";
import { CrawlResult } from "@/shared/lib/firecrawl";

interface CrawlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrawlModal({ isOpen, onClose }: CrawlModalProps) {
  const [url, setUrl] = useState("");
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CrawlResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  const handleCrawl = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedPage(null);

    try {
      const data = await crawlWebsiteAction(url, {
        limit,
        formats: ["markdown", "links"],
      });

      if (data) {
        setResult(data);
      } else {
        setError(
          "Failed to crawl website. Please check the URL and try again.",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUrl("");
    setResult(null);
    setError(null);
    setSelectedPage(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[900px] max-h-[80vh] bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Crawl Website</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Input Section */}
            <div className="p-4 border-b border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter website URL (e.g., https://docs.example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCrawl()}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="w-20"
                  title="Max pages to crawl"
                />
                <Button onClick={handleCrawl} disabled={loading || !url.trim()}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Crawling...
                    </>
                  ) : (
                    "Crawl"
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Max pages: {limit} (higher = more credits used)
              </p>
            </div>

            {/* Result Section */}
            <div className="flex-1 overflow-auto p-4">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
                  {error}
                </div>
              )}

              {result && (
                <div className="flex gap-4 h-full">
                  {/* Page List */}
                  <div className="w-64 border-r border-border pr-4 space-y-2 overflow-auto">
                    <h3 className="font-medium text-sm text-muted-foreground mb-3">
                      Crawled {result.data.length} pages
                    </h3>
                    {result.data.map((page, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedPage(i)}
                        className={`w-full text-left p-2 rounded-lg text-sm transition ${
                          selectedPage === i
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 shrink-0" />
                          <span className="truncate">
                            {page.metadata?.title || `Page ${i + 1}`}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Page Content */}
                  <div className="flex-1 overflow-auto">
                    {selectedPage !== null ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">
                            {result.data[selectedPage].metadata?.title}
                          </h3>
                          <a
                            href={result.data[selectedPage].metadata?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 text-sm"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open
                          </a>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4 max-h-[400px] overflow-auto">
                          <pre className="text-sm whitespace-pre-wrap font-mono">
                            {result.data[selectedPage].markdown}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Select a page to view content
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!result && !error && !loading && (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <Globe className="w-12 h-12 mb-4 opacity-30" />
                  <p>Enter a website URL to crawl all pages</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

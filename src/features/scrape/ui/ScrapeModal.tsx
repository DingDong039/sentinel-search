"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Loader2, X, FileText, Code } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { scrapeUrlAction } from "@/app/actions";
import { ScrapeResult } from "@/shared/lib/firecrawl";

interface ScrapeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScrapeModal({ isOpen, onClose }: ScrapeModalProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"markdown" | "html">("markdown");

  const handleScrape = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await scrapeUrlAction(url, {
        formats: ["markdown", "html", "links"],
      });

      if (data) {
        setResult(data);
      } else {
        setError("Failed to scrape URL. Please check the URL and try again.");
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
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[800px] max-h-[80vh] bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Scrape URL</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Input Section */}
            <div className="p-4 border-b border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter URL to scrape (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                  className="flex-1"
                />
                <Button
                  onClick={handleScrape}
                  disabled={loading || !url.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scraping...
                    </>
                  ) : (
                    "Scrape"
                  )}
                </Button>
              </div>
            </div>

            {/* Result Section */}
            <div className="flex-1 overflow-auto p-4">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
                  {error}
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  {/* Metadata */}
                  {result.metadata && (
                    <div className="p-3 bg-muted rounded-lg">
                      <h3 className="font-medium text-sm text-muted-foreground mb-2">
                        Page Info
                      </h3>
                      <p className="font-semibold">{result.metadata.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {result.metadata.url}
                      </p>
                    </div>
                  )}

                  {/* View Toggle */}
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "markdown" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("markdown")}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Markdown
                    </Button>
                    <Button
                      variant={viewMode === "html" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("html")}
                    >
                      <Code className="w-4 h-4 mr-1" />
                      HTML
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="bg-muted/50 rounded-lg p-4 max-h-[400px] overflow-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {viewMode === "markdown" ? result.markdown : result.html}
                    </pre>
                  </div>

                  {/* Links */}
                  {result.links && result.links.length > 0 && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-2">
                        Found {result.links.length} links
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {result.links.slice(0, 10).map((link, i) => (
                          <a
                            key={i}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2 py-1 bg-primary/10 rounded hover:bg-primary/20 truncate max-w-[200px]"
                          >
                            {link}
                          </a>
                        ))}
                        {result.links.length > 10 && (
                          <span className="text-xs text-muted-foreground">
                            +{result.links.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!result && !error && !loading && (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <Link2 className="w-12 h-12 mb-4 opacity-30" />
                  <p>Enter a URL and click Scrape to get LLM-ready content</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

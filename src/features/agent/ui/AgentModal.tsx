"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Loader2, X, Sparkles } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { runAgentAction } from "@/app/actions";
import { AgentResult } from "@/shared/lib/firecrawl";

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AgentModal({ isOpen, onClose }: AgentModalProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await runAgentAction(prompt);

      if (data) {
        setResult(data);
      } else {
        setError("Agent failed to gather data. Try a different prompt.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPrompt("");
    setResult(null);
    setError(null);
    onClose();
  };

  const examplePrompts = [
    "Find the top 5 AI startups founded in 2024 and their funding",
    "Get the pricing plans for popular cloud hosting providers",
    "Research the main features of React, Vue, and Angular frameworks",
  ];

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
                <Bot className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">AI Agent</h2>
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  NEW
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Input Section */}
            <div className="p-4 border-b border-border">
              <textarea
                placeholder="Describe what data you want to gather from the web..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-3 py-2 min-h-[100px] bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(example)}
                      className="text-xs px-2 py-1 bg-muted rounded hover:bg-muted/80 transition truncate max-w-[200px]"
                      title={example}
                    >
                      {example.slice(0, 30)}...
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleRun}
                  disabled={loading || !prompt.trim()}
                  className="ml-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Run Agent
                    </>
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
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Agent Results</h3>
                    {result.creditsUsed && (
                      <span className="text-xs text-muted-foreground">
                        Credits used: {result.creditsUsed}
                      </span>
                    )}
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 max-h-[400px] overflow-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {!result && !error && !loading && (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-center">
                  <Bot className="w-12 h-12 mb-4 opacity-30" />
                  <p className="max-w-md">
                    AI Agent autonomously searches and extracts structured data
                    from anywhere on the web based on your prompt
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

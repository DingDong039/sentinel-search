"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import {
  SearchIcon,
  Briefcase,
  ShoppingBag,
  Loader2,
  Newspaper,
  Link2,
  Globe,
  Bot,
  AlertTriangle,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSearchStore } from "@/entities/search/model/store";

import { ModeToggle } from "@/shared/ui/mode-toggle";
import { ScrapeModal } from "@/features/scrape/ui/ScrapeModal";
import { CrawlModal } from "@/features/crawl/ui/CrawlModal";
import { AgentModal } from "@/features/agent/ui/AgentModal";

export default function Dashboard() {
  /* Refactored to use Zustand Store */
  const {
    query,
    jobs,
    products,
    news,
    loading,
    error,
    setQuery,
    clearError,
    performSearch,
  } = useSearchStore();

  // Modal states
  const [scrapeOpen, setScrapeOpen] = useState(false);
  const [crawlOpen, setCrawlOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);

  const handleSearch = () => {
    performSearch();
  };

  return (
    <div className="space-y-8 relative">
      <div className="absolute top-0 right-0 z-50">
        <ModeToggle />
      </div>

      {/* Modals */}
      <ScrapeModal isOpen={scrapeOpen} onClose={() => setScrapeOpen(false)} />
      <CrawlModal isOpen={crawlOpen} onClose={() => setCrawlOpen(false)} />
      <AgentModal isOpen={agentOpen} onClose={() => setAgentOpen(false)} />

      {/* Error Alert Banner */}
      {error && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full mx-4 px-4 py-3 rounded-lg border shadow-lg flex items-center gap-3 ${
            error.type === "credits_exhausted"
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
              : error.type === "rate_limit"
                ? "bg-orange-500/10 border-orange-500/30 text-orange-500"
                : "bg-destructive/10 border-destructive/30 text-destructive"
          }`}
        >
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">
              {error.type === "credits_exhausted"
                ? "Firecrawl Credits Exhausted"
                : error.type === "rate_limit"
                  ? "Rate Limit Exceeded"
                  : "Search Error"}
            </p>
            <p className="text-xs opacity-80">
              {error.type === "credits_exhausted"
                ? "Visit firecrawl.dev/pricing to add more credits"
                : error.type === "rate_limit"
                  ? "Please wait a moment and try again"
                  : error.message}
            </p>
          </div>
          <button
            onClick={clearError}
            className="p-1 hover:bg-white/10 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header / Command Center */}
      <section className="flex flex-col gap-4 items-center justify-center py-10 relative">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tighter text-foreground text-center z-10"
        >
          SENTINEL
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-2xl mt-6 relative z-10"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-primary via-purple-500 to-accent rounded-lg opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
            <div className="relative flex items-center bg-background/80 backdrop-blur-xl rounded-lg border border-border p-1">
              <SearchIcon className="ml-3 text-muted-foreground size-5" />
              <Input
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg py-6 placeholder:text-muted-foreground/50"
                placeholder="Search for trends, stocks, jobs, or products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                size="lg"
                onClick={handleSearch}
                disabled={loading}
                className="rounded-md bg-primary/10 hover:bg-primary/20 text-primary border border-primary/10"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Search"}
              </Button>
            </div>
          </div>

          {/* Tool Buttons */}
          <div className="flex justify-center gap-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScrapeOpen(true)}
              className="gap-2"
            >
              <Link2 className="w-4 h-4" />
              Scrape URL
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCrawlOpen(true)}
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              Crawl Site
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAgentOpen(true)}
              className="gap-2"
            >
              <Bot className="w-4 h-4" />
              AI Agent
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                NEW
              </span>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Main Content Grid */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-background/50 border border-border backdrop-blur-md p-1 h-12">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
          <TabsTrigger value="products">
            Products ({products.length})
          </TabsTrigger>
          <TabsTrigger value="news">News ({news.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Remote Jobs"
              value={jobs.length.toString()}
              change="Found"
              icon={Briefcase}
              color="text-purple-500"
            />
            <MetricCard
              title="Products"
              value={products.length.toString()}
              change="Found"
              icon={ShoppingBag}
              color="text-orange-500"
            />
            <MetricCard
              title="News Articles"
              value={news.length.toString()}
              change="Latest"
              icon={Newspaper}
              color="text-blue-400"
            />
          </div>

          {/* Recent Results Preview */}
          {(jobs.length > 0 || products.length > 0 || news.length > 0) && (
            <div className="grid gap-6 md:grid-cols-3">
              {jobs.length > 0 && (
                <Card className="bg-card/50 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Latest Job</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-semibold truncate">
                      {jobs[0].title}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {jobs[0].company}
                    </div>
                  </CardContent>
                </Card>
              )}
              {products.length > 0 && (
                <Card className="bg-card/50 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Top Product</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-semibold truncate">
                      {products[0].title}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {products[0].currency} {products[0].currentPrice}
                    </div>
                  </CardContent>
                </Card>
              )}
              {news.length > 0 && (
                <Card className="bg-card/50 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Breaking News</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-semibold truncate">
                      {news[0].title}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {news[0].source}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          {jobs.map((job, i) => (
            <Card
              key={i}
              className="bg-card/50 border-border hover:bg-accent/50 transition-colors backdrop-blur-sm"
            >
              <CardHeader>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <CardDescription className="truncate">
                  {job.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  View Job &rarr;
                </a>
              </CardContent>
            </Card>
          ))}
          {jobs.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-10">
              No jobs found. Try searching for &quot;Software Engineer
              Thailand&quot;.
            </div>
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          {products.map((prod, i) => (
            <Card
              key={i}
              className="bg-card/50 border-border hover:bg-accent/50 transition-colors backdrop-blur-sm"
            >
              <CardHeader>
                <CardTitle className="text-lg">{prod.title}</CardTitle>
                <CardDescription className="truncate">
                  {prod.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href={prod.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  View Product &rarr;
                </a>
              </CardContent>
            </Card>
          ))}
          {products.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-10">
              No products found.
            </div>
          )}
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          {news.map((item, i) => (
            <Card
              key={i}
              className="bg-card/50 border-border hover:bg-accent/50 transition-colors backdrop-blur-sm"
            >
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {item.summary || item.publishedAt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground bg-accent/50 px-2 py-1 rounded">
                    {item.source}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    Read Article &rarr;
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
          {news.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-10">
              No news found.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: MetricCardProps) {
  return (
    <Card className="bg-card/60 border-border backdrop-blur-xl hover:bg-accent/50 transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        <p className={`text-xs ${color} font-medium`}>{change}</p>
      </CardContent>
    </Card>
  );
}

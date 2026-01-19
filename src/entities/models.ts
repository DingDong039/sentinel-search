export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  url: string;
  postedAt: string;
  source: string;
  description?: string;
}

export interface Product {
  id: string;
  title: string;
  currentPrice: number;
  originalPrice?: number;
  currency: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  source: string;
  url: string;
  description?: string;
}

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface News {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary?: string;
  thumbnailUrl?: string;
}

# 🔍 Sentinel Search

> AI-Powered Web Search & Scraping Dashboard

A modern, feature-rich web application for intelligent web searching, scraping, and data extraction powered by [Firecrawl](https://firecrawl.dev/).

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## ✨ Features

- 🔎 **Web Search** - Search the web with AI-powered results and markdown extraction
- 🌐 **Web Scraping** - Scrape any URL and extract content in various formats
- 🕷️ **Web Crawling** - Crawl entire websites with configurable depth and limits
- 🤖 **AI Agent** - Intelligent agent for autonomous web data gathering
- 🌙 **Dark/Light Mode** - Beautiful theme support with smooth transitions
- 📊 **Analytics Dashboard** - Track your search history and metrics
- 💾 **Supabase Integration** - Persistent storage for search history

## 🛠️ Tech Stack

| Layer            | Technology                 |
| ---------------- | -------------------------- |
| Framework        | Next.js 16 (App Router)    |
| Language         | TypeScript 5 (Strict Mode) |
| UI Components    | Radix UI + shadcn/ui       |
| Styling          | Tailwind CSS v4            |
| State Management | Zustand                    |
| Animations       | Framer Motion              |
| Charts           | Recharts                   |
| Backend          | Firecrawl API              |
| Database         | Supabase                   |

## 📁 Architecture

This project follows **Feature-Sliced Design (FSD)** architecture:

```text
src/
├── app/           # Next.js App Router pages
├── entities/      # Business entities (search, products)
├── features/      # User interactions (scrape, crawl, agent)
├── shared/        # Shared utilities, UI components, libs
└── widgets/       # Composite UI blocks (dashboard, layout)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Firecrawl API Key ([Get one here](https://firecrawl.dev/))
- Supabase Project (optional, for history persistence)

### Installation

```bash
# Clone the repository
git clone https://github.com/DingDong039/sentinel-search.git
cd sentinel-search

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
FIRECRAWL_API_KEY=your-firecrawl-api-key
```

> ⚠️ **Security Note**: `FIRECRAWL_API_KEY` should NOT have `NEXT_PUBLIC_` prefix to prevent exposure to client-side.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DingDong039/sentinel-search)

1. Connect your GitHub repository
2. Add environment variables in Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `FIRECRAWL_API_KEY`
3. Deploy!

## 📜 Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## 🔐 Security

- API keys are server-side only (no `NEXT_PUBLIC_` prefix)
- All Firecrawl operations run in Server Actions
- Supabase Row Level Security (RLS) ready
- Input validation on all forms

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ by [DingDong039](https://github.com/DingDong039)

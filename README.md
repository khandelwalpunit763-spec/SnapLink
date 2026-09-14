# ⚡ SnapLink

**Download High Quality Videos & Audio in Seconds**

SnapLink is a fast, SEO-optimized, mobile-first web app to download videos & MP3 audio from **YouTube, Instagram Reels, Facebook and X (Twitter)** — up to **4K / 1080p / 720p / 480p + MP3**. No sign-up, no watermark, no forced redirects.

| | |
|---|---|
| **Frontend** | Next.js 15 (App Router) · React 19 · Tailwind CSS 4 · Lucide Icons · TypeScript |
| **Backend** | Next.js Serverless Route Handler (`/api/download`) with pluggable providers |
| **Providers** | A) RapidAPI · B) Self-hosted Node.js + yt-dlp server (bundled in `/server`) · C) Demo (oEmbed metadata) |
| **Deploy** | Vercel-ready (edge regions preconfigured for India: `bom1`) |
| **Theme** | Slate dark/light mode with accent blue `#2563eb` + green `#10b981` |

---

## ✨ Features

- **Smart link detection** — auto-detects YouTube / Instagram / Facebook / X from the pasted URL (incl. `youtu.be`, `fb.watch`, `t.co` short links).
- **Single input + Paste + Download** — one field, clipboard Paste button, Enter-to-download.
- **Animated processing state** — skeleton loader with shimmer while metadata is fetched.
- **Video preview card** — real thumbnail, title, author, duration badge, platform chip.
- **Quality options** — 4K, 1080p HD, 720p, 480p, 360p (only what the source offers) + **MP3 audio**, each with a *copy direct link* button.
- **Direct download trigger** — plain `<a download>` links, zero popups/redirects.
- **AdSense-ready** — three labelled placeholder slots (header, below download button, footer) that become live ads the moment you set your AdSense env vars.
- **SEO** — meta keywords (*Cricket Video Downloader, Instagram Reel Downloader, SnapLink HD Downloader* + more), Open Graph + Twitter cards, auto-generated OG image, `sitemap.xml`, `robots.txt`, JSON-LD (`WebSite` + `WebApplication` + `FAQPage`), keyword-rich guide/FAQ sections.
- **Core Web Vitals** — static page, zero client-side frameworks beyond React, system-prefetched Inter font, no render-blocking assets.
- **Dark/light mode** — class-based, no flash-of-wrong-theme (inline script), persisted in `localStorage`.

---

## 🚀 Quick start (local)

```bash
git clone <your-repo-url> snaplink
cd snaplink
npm install
npm run dev          # http://localhost:3000
```

> With **no API key** the app runs in **demo mode**: metadata (title, thumbnail, duration for YouTube) is fetched live via public oEmbed, so the preview card is real — but the quality buttons show *locked* until you connect an API (below).

Production build:

```bash
npm run build
npm start
```

---

## 🔌 API setup (3 options)

The route handler `/api/download` tries providers in order (configurable via `API_PROVIDER`):

```
self-hosted API  →  RapidAPI  →  demo (oEmbed, always works)
```

Copy `.env.example` → `.env.local` and fill what you need.

### Option A — RapidAPI (easiest, serverless-friendly)

1. Create a free account at [rapidapi.com](https://rapidapi.com).
2. Subscribe to a video-downloader product for each platform (e.g. *YouTube Video Downloader*, *Instagram Reels Downloader*, *Facebook Video Downloader*, *Twitter/X Video Downloader*).
3. Note each product's **host** and **endpoint path** from the *API* tab.
4. Set env vars:

| Variable | Example | Notes |
|---|---|---|
| `RAPIDAPI_KEY` | `xxxxxxxx` | your `x-rapidapi-key` (one key works for all) |
| `RAPIDAPI_YT_HOST` | `your-product.p.rapidapi.com` | YouTube product host |
| `RAPIDAPI_YT_PATH` | `/api/youtube/downloader` | its endpoint path |
| `RAPIDAPI_IG_HOST` / `RAPIDAPI_IG_PATH` | … | Instagram |
| `RAPIDAPI_FB_HOST` / `RAPIDAPI_FB_PATH` | … | Facebook |
| `RAPIDAPI_TW_HOST` / `RAPIDAPI_TW_PATH` | … | X/Twitter |
| `API_PROVIDER` | `rapidapi` | or leave `auto` |

> **Note:** RapidAPI hosts many similar products with different shapes — defaults in [`src/lib/api/config.ts`](src/lib/api/config.ts) follow the common convention, and the response **normalizer** (`src/lib/api/normalize.ts`) tolerantly maps the usual response fields (`formats[]`, `links{}` maps, `download_url`/`audio_url`, quality strings like `1920x1080`, `1080p`, `4k`…). If your product uses a different param name for the URL, also tweak `urlParam` in the config.
>
> If a RapidAPI call fails (quota/403), SnapLink **auto-falls back to demo mode** so the UI never breaks.

### Option B — Self-hosted Node.js + yt-dlp (bundled, best performance)

The repo ships a small Express service in [`/server`](server/) that uses `yt-dlp` + `ffmpeg`:

```
POST /api/extract  { "url": "..." }        → metadata + quality list
GET  /api/stream   ?url=...&q=1080p|720p…  → streams the final file
GET  /health                              → { ok: true }
```

It streams the finished MP4/MP3 from **your** server, so end-user IPs are never exposed to source sites (avoids IP blocking), and quality merging is handled by yt-dlp/ffmpeg.

**Run it anywhere Node runs** — VPS, Railway, Fly.io, Render, home server:

```bash
cd server
npm install
# needs yt-dlp + ffmpeg on PATH  (e.g.  brew install yt-dlp ffmpeg / apt install ffmpeg)
npm start        # :8787
```

Or with Docker (installs everything):

```bash
docker build -t snaplink-api server/
docker run -d -p 8787:8787 snaplink-api
```

Then in the app's env:

```
DOWNLOADER_API_URL=https://your-api.yourdomain.com
```

> Vercel **cannot** run this service (no binaries/long jobs) — that's exactly why it's a separate deployable. The Next.js frontend on Vercel calls it across origins (CORS is pre-enabled).

### Option C — Demo mode (zero config)

Nothing to do. Public oEmbed gives real titles/thumbnails (YouTube also returns duration via watch-page parsing). Quality buttons render locked with an "Open source video" action. Perfect for previewing the product, demos, and SEO content before you connect a backend.

---

## ▲ Deploy to Vercel

1. Push this repo to GitHub (see below).
2. Go to [vercel.com/new](https://vercel.com/new) → **Import** the `snaplink` repo.
3. Framework preset: **Next.js** (auto-detected). Build command `next build`, output `.next` — defaults are fine.
4. Add **Environment Variables** (at least Production):
   - `NEXT_PUBLIC_SITE_URL=https://yourdomain.vercel.app` (or your custom domain)
   - Your API vars: `RAPIDAPI_KEY` + hosts (**Option A**) *and/or* `DOWNLOADER_API_URL` (**Option B**)
   - AdSense vars (optional): `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT_HEADER/RESULTS/FOOTER`
5. **Deploy**. 🎉

Tips:
- **Custom domain:** Vercel → Project → Settings → Domains → add `snaplink.example.com` (CNAME auto). After DNS propagates, set `NEXT_PUBLIC_SITE_URL` to the custom domain and redeploy so `sitemap.xml`, `robots.txt` and OG/canonical URLs use it.
- **Regions:** `vercel.json` pins `bom1` (Bengaluru) + `sfo1` for low latency from India; edit or delete if you prefer elsewhere.
- **Preview URLs:** every git push/PR gets a unique preview deployment automatically.

### Push to GitHub (if not done yet)

```bash
cd snaplink
git remote add origin https://github.com/<your-username>/snaplink.git
git push -u origin main
```

(The workspace repo is already `git init`'d with an initial commit.)

---

## 💰 Google AdSense setup

1. Get approved at [adsense.google.com](https://adsense.google.com) (a live domain with your domain in `NEXT_PUBLIC_ADSENSE_CLIENT` helps).
2. Set env vars:
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
   NEXT_PUBLIC_ADSENSE_SLOT_HEADER=1234567890
   NEXT_PUBLIC_ADSENSE_SLOT_RESULTS=2345678901
   NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=3456789012
   ```
3. Rebuild/redeploy. The placeholders are replaced by live responsive ads (header leaderboard, in-content below the download buttons, footer leaderboard). Until then, subtle dashed placeholders keep the layout stable and don't affect Core Web Vitals.

---

## 📁 Project structure

```
snaplink/
├── app/
│   ├── api/download/route.ts     # Serverless function: validate → detect → extract
│   ├── layout.tsx                # Metadata (SEO/OG/Twitter), theme script, Inter font
│   ├── page.tsx                  # Hero + all sections + JSON-LD
│   ├── globals.css               # Tailwind v4 theme (slate + blue/emerald, animations)
│   ├── icon.svg                  # Favicon (gradient bolt)
│   ├── opengraph-image.tsx       # Auto-generated 1200×630 OG image
│   ├── manifest.ts               # PWA manifest
│   ├── robots.ts / sitemap.ts    # SEO plumbing
├── components/
│   ├── Downloader.tsx            # Input, Paste/Download, loading, error states
│   ├── PreviewCard.tsx           # Thumbnail, title, duration, quality buttons, copy-link
│   ├── AdSlot.tsx                # AdSense (real ads or labelled placeholder)
│   ├── Header / ThemeToggle      # Sticky nav, dark/light toggle
│   ├── Steps / PlatformGrid / Features / FAQ / SEOContent / Footer
├── lib/
│   ├── detectPlatform.ts         # Smart URL → platform detection (+ t.co resolve)
│   ├── types.ts / utils.ts
│   └── api/
│       ├── index.ts              # Provider chain: self → rapidapi → demo
│       ├── rapidapi.ts           # Option A
│       ├── selfapi.ts            # Option B
│       ├── demo.ts               # Option C (oEmbed metadata)
│       ├── config.ts             # RapidAPI host/path per platform (env-overridable)
│       └── normalize.ts          # Tolerant response normalizer → canonical qualities
├── server/                       # Option B: self-hosted yt-dlp Express API
│   ├── index.js                  # /api/extract + /api/stream (mp4/mp3) + /health
│   ├── Dockerfile                # node:20-slim + yt-dlp + ffmpeg
│   └── package.json
├── vercel.json                   # Edge regions (bom1, sfo1)
├── .env.example                  # All env vars documented
└── README.md
```

## 🛠 Troubleshooting

| Symptom | Fix |
|---|---|
| RapidAPI `401/403` | Wrong key, or key subscribed to a different host — check `RAPIDAPI_*_HOST` matches the product you paid for. |
| RapidAPI works but no quality buttons | Your product returns an unusual shape — check the API's *Try It* response and add its field names to `normalize.ts`. |
| Demo mode only shows a generic card (IG/FB) | Those platforms' public oEmbed is rate-limited/region-locked — expected. Connect Option A or B for full data. |
| Self-hosted server `yt-dlp: not found` | Install yt-dlp/ffmpeg or use the provided Dockerfile. Keep `yt-dlp` updated (`yt-dlp -U`) — sites change often. |
| YouTube 403 from the self-hosted server | Some datacenter IPs get challenged; retry later, or add cookies via yt-dlp `--cookies` on your host. |
| t.co link shows "unsupported" | Short-link resolution timed out — paste the full x.com URL instead. |

## ⚖️ Legal

SnapLink does not store, host, or transcode user videos on its own infrastructure (Option B streams through your server on demand). **Users are responsible for respecting copyright** — only download content you own or that is licensed for offline use. The footer + FAQ carry the standard disclaimer; keep it.

## 📄 License

MIT — use it, fork it, ship it.

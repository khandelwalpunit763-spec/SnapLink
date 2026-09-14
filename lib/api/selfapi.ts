import type { Platform, VideoData } from '../types';

/**
 * Option B — self-hosted custom Node.js API (see /server).
 * Point DOWNLOADER_API_URL at the bundled yt-dlp Express service (or any
 * compatible JSON API). Running it on your own VPS keeps the heavy lifting
 * off serverless and avoids the user's IP getting blocked by source sites.
 */
export async function extractWithSelfApi(url: string, _platform: Platform): Promise<VideoData | null> {
  const base = process.env.DOWNLOADER_API_URL;
  if (!base) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90000);
  let res: Response;
  try {
    res = await fetch(`${base.replace(/\/+$/, '')}/api/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Self API ${res.status}: ${text.slice(0, 160)}`);
  }

  const data = (await res.json()) as { video?: VideoData };
  if (!data?.video?.title) return null;
  return { ...data.video, provider: 'self-api', demo: false };
}

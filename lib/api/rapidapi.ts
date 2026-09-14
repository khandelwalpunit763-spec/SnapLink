import type { Platform, VideoData } from '../types';
import { getRapidApiConfig } from './config';
import { buildVideoFromRoot } from './normalize';

/**
 * Option A — RapidAPI.
 * Calls a RapidAPI "video downloader" product using the x-rapidapi-key /
 * x-rapidapi-host headers. The response is normalized tolerantly so several
 * popular RapidAPI products work without code changes.
 */
export async function extractWithRapidApi(url: string, platform: Platform): Promise<VideoData | null> {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return null;

  const cfg = getRapidApiConfig(platform);
  const endpoint = `https://${cfg.host}${cfg.path}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  let res: Response;
  try {
    if (cfg.method === 'GET') {
      const u = new URL(endpoint);
      u.searchParams.set(cfg.urlParam, url);
      res = await fetch(u.toString(), {
        signal: controller.signal,
        headers: {
          'x-rapidapi-key': key,
          'x-rapidapi-host': cfg.host,
          'User-Agent': 'SnapLink/1.0',
        },
      });
    } else {
      res = await fetch(endpoint, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'x-rapidapi-key': key,
          'x-rapidapi-host': cfg.host,
          'Content-Type': 'application/json',
          'User-Agent': 'SnapLink/1.0',
        },
        body: JSON.stringify({ [cfg.urlParam]: url }),
      });
    }
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`RapidAPI ${res.status}: ${text.slice(0, 160)}`);
  }

  const root: unknown = await res.json();
  return buildVideoFromRoot(root, url, platform, 'rapidapi');
}

import type { Platform, VideoData } from '../types';
import { formatDuration, hashId } from '../utils';
import { asStr, asNum } from './normalize';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const PLATFORM_LABEL: Record<Platform, string> = {
  youtube: 'YouTube Video',
  instagram: 'Instagram Reel / Post',
  facebook: 'Facebook Video',
  twitter: 'X (Twitter) Video',
};

async function fetchJson(url: string, timeoutMs = 12000): Promise<Record<string, unknown> | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': UA, Accept: 'application/json' } });
    if (!res.ok) return null;
    const text = await res.text();
    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return null;
    }
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function ytVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0];
      return /^[\w-]{6,}$/.test(id) ? id : null;
    }
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const m = u.pathname.match(/\/(shorts|embed|live|v)\/([\w-]{6,})/);
    return m ? m[2] : null;
  } catch {
    return null;
  }
}

async function youtubeDuration(id: string): Promise<number | undefined> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${id}&hl=en&gl=US`, {
      signal: controller.signal,
      headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en' },
    });
    if (!res.ok) return undefined;
    const html = await res.text();
    const len = html.match(/"lengthSeconds":"(\d+)"/);
    if (len) return parseInt(len[1], 10);
    const approx = html.match(/"approxDurationMs":(\d+)/);
    if (approx) return Math.round(parseInt(approx[1], 10) / 1000);
    return undefined;
  } catch {
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Option C — demo fallback (no API key needed).
 * Fetches REAL metadata via public oEmbed endpoints (title, author,
 * thumbnail, and for YouTube even the duration) so the preview card looks
 * authentic. Real download links require a connected API (A or B).
 */
export async function extractDemo(url: string, platform: Platform): Promise<VideoData> {
  let title: string | undefined;
  let author: string | undefined;
  let thumbnail: string | undefined;
  let duration: number | undefined;

  if (platform === 'youtube') {
    const id = ytVideoId(url);
    if (id) {
      const o = await fetchJson(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      title = asStr(o?.title);
      author = asStr(o?.author_name);
      thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
      duration = await youtubeDuration(id);
    }
  }

  if (!title) {
    const endpoints: string[] = [];
    if (platform === 'instagram') endpoints.push(`https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(url)}&omit_story_mode=1`);
    endpoints.push(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    for (const e of endpoints) {
      const o = await fetchJson(e);
      if (o && asStr(o.title)) {
        title = asStr(o.title);
        author = asStr(o.author_name) || asStr(o.provider_name);
        if (asStr(o.thumbnail_url)) thumbnail = asStr(o.thumbnail_url);
        const dur = asNum(o.duration);
        if (dur) duration = dur;
        break;
      }
    }
  }

  return {
    id: hashId(url),
    platform,
    sourceUrl: url,
    title: title || PLATFORM_LABEL[platform],
    author,
    thumbnail,
    duration,
    durationLabel: duration != null ? formatDuration(duration) : undefined,
    provider: 'demo',
    demo: true,
    message:
      'Demo mode: real metadata loaded, but download links are unlocked once you connect a RapidAPI key or the self-hosted API (see README → API setup).',
    formats: [],
  };
}

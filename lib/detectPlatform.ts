import type { Platform } from './types';

export const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'X / Twitter',
};

const YT_HOSTS = ['youtube.com', 'youtu.be', 'youtube-nocookie.com', 'music.youtube.com', 'youtube.co'];
const FB_HOSTS = ['facebook.com', 'fb.com', 'fb.watch', 'fb.me'];

/**
 * Smart link detection — figures out which platform a pasted URL belongs to.
 * Returns null when the URL is not from a supported platform.
 */
export function detectPlatform(raw: string): Platform | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase().replace(/^(www|m|mobile|music)\./, '');

  if (YT_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return 'youtube';
  if (host === 'instagram.com') return 'instagram';
  if (FB_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) return 'facebook';
  if (host === 'twitter.com' || host === 'x.com' || host === 't.co') return 'twitter';
  return null;
}

/**
 * Resolves t.co (X/Twitter) short links by following the redirect
 * so we can detect the real destination platform.
 */
export async function resolveShortLink(url: string): Promise<string> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  if (parsed.hostname !== 't.co') return url;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SnapLink/1.0)' },
    });
    clearTimeout(timer);
    return res.url || url;
  } catch {
    return url;
  }
}

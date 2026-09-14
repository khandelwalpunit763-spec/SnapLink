import type { Platform, VideoData } from '../types';
import { extractWithCobalt } from './cobalt';
import { extractWithRapidApi } from './rapidapi';
import { extractWithSelfApi } from './selfapi';
import { extractDemo } from './demo';

/** Generic placeholder titles used by the demo extractor when no metadata is found. */
const GENERIC_TITLES = new Set(['YouTube Video', 'Instagram Reel / Post', 'Facebook Video', 'X (Twitter) Video']);

/**
 * Download-provider chain.
 *
 * Order (auto mode): cobalt (free, no key — best for YouTube) → RapidAPI
 * (needs RAPIDAPI_KEY — better for Instagram/Facebook/X) → self-hosted
 * yt-dlp API (needs DOWNLOADER_API_URL). The first provider that returns
 * at least one downloadable format wins; the rest are fallbacks.
 *
 * Real metadata (oEmbed: title/thumbnail/duration) is always fetched in
 * parallel so the preview card stays rich even when a provider is down.
 */
export async function extractVideo(url: string, platform: Platform): Promise<VideoData> {
  const metaPromise = extractDemo(url, platform).catch(() => null);

  const provider = (process.env.API_PROVIDER || 'auto').toLowerCase();
  const attempts: Array<{ name: string; run: () => Promise<VideoData | null> }> = [];
  if (provider === 'auto' || provider === 'cobalt') attempts.push({ name: 'cobalt', run: () => extractWithCobalt(url, platform) });
  if (provider === 'auto' || provider === 'rapidapi') attempts.push({ name: 'rapidapi', run: () => extractWithRapidApi(url, platform) });
  if (provider === 'auto' || provider === 'self') attempts.push({ name: 'self-api', run: () => extractWithSelfApi(url, platform) });

  let result: VideoData | null = null;
  let lastError: unknown = null;
  for (const { name, run } of attempts) {
    try {
      const r = await run();
      if (r && r.formats.length > 0) {
        result = r;
        break;
      }
    } catch (e) {
      lastError = e;
      console.error(`[snaplink] ${name} provider failed:`, e instanceof Error ? e.message : e);
    }
  }

  const meta = await metaPromise;

  if (result) {
    const metaTitle = meta?.title && !GENERIC_TITLES.has(meta.title) ? meta.title : undefined;
    return {
      ...result,
      // Prefer rich oEmbed metadata; fall back to whatever the provider gave us
      title: metaTitle || result.title,
      author: meta?.author || result.author,
      thumbnail: meta?.thumbnail || result.thumbnail,
      duration: meta?.duration ?? result.duration,
      durationLabel: meta?.durationLabel || result.durationLabel,
      demo: false,
      message: undefined,
    };
  }

  // Every provider failed — still show real metadata with the locked grid so
  // the site degrades gracefully instead of looking broken.
  if (meta) {
    return {
      ...meta,
      demo: true,
      message:
        'Metadata loaded, but the download service could not process this platform right now. Try again in a minute — YouTube links work best. (For reliable Instagram/Facebook/X, connect a RapidAPI key or the self-hosted API — see README → API setup.)',
    };
  }

  throw lastError instanceof Error ? lastError : new Error('Extraction failed');
}

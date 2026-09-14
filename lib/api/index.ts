import type { Platform, VideoData } from '../types';
import { extractDemo } from './demo';
import { extractWithRapidApi } from './rapidapi';
import { extractWithSelfApi } from './selfapi';

type Chain = Array<'self' | 'rapidapi' | 'demo'>;

function providerChain(): Chain {
  const forced = (process.env.API_PROVIDER ?? 'auto').toLowerCase();
  if (forced === 'demo') return ['demo'];
  if (forced === 'self') return ['self', 'demo'];
  if (forced === 'rapidapi') return ['rapidapi', 'demo'];
  if (process.env.DOWNLOADER_API_URL) return ['self', 'rapidapi', 'demo'];
  if (process.env.RAPIDAPI_KEY) return ['rapidapi', 'demo'];
  return ['demo'];
}

/**
 * Extract video metadata + download links.
 * Tries providers in order (self-hosted API → RapidAPI → demo oEmbed) and
 * always resolves with something renderable.
 */
export async function extractVideo(url: string, platform: Platform): Promise<VideoData> {
  for (const p of providerChain()) {
    if (p === 'demo') break;
    try {
      const result = p === 'self' ? await extractWithSelfApi(url, platform) : await extractWithRapidApi(url, platform);
      if (result && (result.title || result.thumbnail || result.formats.length > 0)) return result;
    } catch (err) {
      console.error(`[snaplink] provider "${p}" failed:`, err instanceof Error ? err.message : err);
    }
  }
  return extractDemo(url, platform);
}

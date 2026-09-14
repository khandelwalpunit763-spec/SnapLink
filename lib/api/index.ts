import type { Platform, VideoData } from '../types';
import { extractDemo } from './demo';
import { extractWithRapidApi } from './rapidapi';
import { extractWithSelfApi } from './selfapi';
import { extractWithCobalt } from './cobalt';

type Chain = Array<'cobalt' | 'self' | 'rapidapi' | 'demo'>;

function providerChain(): Chain {
  const forced = (process.env.API_PROVIDER ?? 'auto').toLowerCase();
  if (forced === 'demo') return ['demo'];
  if (forced === 'cobalt') return ['cobalt', 'demo'];
  if (forced === 'self') return ['self', 'demo'];
  if (forced === 'rapidapi') return ['rapidapi', 'demo'];
  
  // Default Order: Pehle Cobalt try karega (Free & No Card), fir bakiyoki baari
  return ['cobalt', 'self', 'rapidapi', 'demo'];
}

/**
 * Extract video metadata + download links.
 */
export async function extractVideo(url: string, platform: Platform): Promise<VideoData> {
  for (const p of providerChain()) {
    if (p === 'demo') break;
    try {
      let result: VideoData | null = null;
      if (p === 'cobalt') result = await extractWithCobalt(url, platform);
      else if (p === 'self') result = await extractWithSelfApi(url, platform);
      else if (p === 'rapidapi') result = await extractWithRapidApi(url, platform);

      if (result && (result.title || result.thumbnail || result.formats.length > 0)) return result;
    } catch (err) {
      console.error(`[snaplink] provider "${p}" failed:`, err instanceof Error ? err.message : err);
    }
  }
  return extractDemo(url, platform);
}
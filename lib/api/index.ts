import type { Platform, VideoData } from '../types';
import { extractDemo } from './demo';
import { extractWithRapidApi } from './rapidapi';
import { extractWithSelfApi } from './selfapi';
import { extractWithCobalt } from './cobalt';

export async function extractVideo(url: string, platform: Platform): Promise<VideoData> {
  // Direct Cobalt try karega pehle (Demo mode skip karke)
  try {
    const result = await extractWithCobalt(url, platform);
    if (result && (result.title || result.formats.length > 0)) {
      return result;
    }
  } catch (err) {
    console.error(`[snaplink] Cobalt failed, fallback to demo:`, err instanceof Error ? err.message : err);
  }

  // Backup fallback
  return extractDemo(url, platform);
}
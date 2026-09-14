// @ts-nocheck
import type { Platform, VideoData } from '../types';
import { extractWithCobalt } from './cobalt';

export async function extractVideo(url: string, platform: Platform): Promise<VideoData> {
  console.log("FORCE STARTING REAL EXTRACTION");
  
  // Hum koi environment variable nahi dekhenge, seedha Cobalt chalayenge
  const result = await extractWithCobalt(url, platform);
  
  if (result) {
    // Ye line lock 🔒 hatane ke liye hai
    result.isDemo = false; 
    return result;
  }
  
  throw new Error("Extraction failed");
}
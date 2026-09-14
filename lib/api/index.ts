import type { Platform, VideoData } from '../types';
import { extractWithCobalt } from './cobalt';

export async function extractVideo(url: string, platform: Platform): Promise<VideoData> {
  console.log(`[snaplink] Attempting real extraction for: ${url}`);
  
  try {
    // Direct Cobalt/VKR try karega
    const result = await extractWithCobalt(url, platform);
    
    if (result && result.formats && result.formats.length > 0) {
      return result;
    }
    
    throw new Error("No formats found");
  } catch (err) {
    console.error(`[snaplink] Extraction failed:`, err);
    // Agar fail hua toh error throw karega, Demo Mode nahi dikhayega
    throw err; 
  }
}
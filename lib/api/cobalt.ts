// @ts-nocheck
import type { Platform, VideoData } from '../types';

export async function extractWithCobalt(url: string, platform: Platform): Promise<VideoData> {
  // Sabse powerful free API jo Vercel par chalti hai
  const apiUrl = `https://api.vkrdown.com/v2/?url=${encodeURIComponent(url)}`;
  
  const res = await fetch(apiUrl);
  const data = await res.json();

  if (!res.ok || !data.data || !data.data.downloads) {
    throw new Error('Video not found or platform restricted');
  }

  const v = data.data;

  return {
    id: 'vkr-' + Date.now(),
    title: v.title || 'Video Downloader',
    platform: platform,
    url: url,
    thumbnail: v.thumbnail || '',
    formats: v.downloads.map((d: any) => ({
      quality: d.quality || 'HD',
      url: d.url,
      ext: d.extension || 'mp4',
      formatId: 'fmt-' + Math.random(),
      needProxy: false
    })),
  } as unknown as VideoData;
}
// @ts-nocheck
import type { Platform, VideoData } from '../types';

export async function extractWithCobalt(url: string, platform: Platform): Promise<VideoData> {
  // 1. Try VKR Free Multi-Downloader API (Bypasses YouTube Vercel IP block)
  try {
    const vkrRes = await fetch(`https://api.vkrdown.com/v2/?url=${encodeURIComponent(url)}`);
    if (vkrRes.ok) {
      const vkrData = await vkrRes.json();
      if (vkrData && vkrData.data) {
        const downloads = vkrData.data.downloads || [];
        if (downloads.length > 0) {
          return {
            id: 'vkr-' + Date.now(),
            title: vkrData.data.title || `${platform.toUpperCase()} Video`,
            platform: platform,
            url: url,
            thumbnail: vkrData.data.thumbnail || '',
            formats: downloads.map((d: any, index: number) => ({
              quality: d.quality || d.format || `Download ${index + 1}`,
              url: d.url,
              ext: d.extension || 'mp4',
              formatId: `fmt-${index}`,
              needProxy: false,
            })),
          } as unknown as VideoData;
        }
      }
    }
  } catch (e) {
    console.log('VKR API failed, trying Cobalt...');
  }

  // 2. Backup Cobalt API
  const res = await fetch('https://api.cobalt.tools/api/json', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: url, videoQuality: '720' }),
  });

  if (!res.ok) throw new Error('Download failed');
  const data = await res.json();
  const mainUrl = data.url || data.picker?.[0]?.url;

  if (!mainUrl) throw new Error('No download link found');

  return {
    id: 'cobalt-' + Date.now(),
    title: `${platform.toUpperCase()} Video`,
    platform: platform,
    url: url,
    thumbnail: data.picker?.[0]?.thumb || '',
    formats: [
      { quality: '720p HD', url: mainUrl, ext: 'mp4', formatId: '720p', needProxy: false },
      { quality: '480p SD', url: mainUrl, ext: 'mp4', formatId: '480p', needProxy: false }
    ],
  } as unknown as VideoData;
}
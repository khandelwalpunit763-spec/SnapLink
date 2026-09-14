// @ts-nocheck
import type { Platform, VideoData } from '../types';

export async function extractWithCobalt(url: string, platform: Platform): Promise<VideoData> {
  const servers = [
    'https://api.cobalt.tools/api/json',
    'https://cobalt-api.kwiatek.xyz/api/json',
  ];

  let data = null;

  for (const serverUrl of servers) {
    try {
      const res = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          videoQuality: '720',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json && json.status !== 'error') {
          data = json;
          break;
        }
      }
    } catch (e) {
      console.log('Server failed, trying next...');
    }
  }

  if (!data) {
    throw new Error('Cobalt extraction failed');
  }

  const mainUrl = data.url || data.picker?.[0]?.url;

  if (!mainUrl) {
    throw new Error('No download link found');
  }

  return {
    id: 'cobalt-' + Date.now(),
    title: `${platform.toUpperCase()} Video`,
    platform: platform,
    url: url,
    thumbnail: data.picker?.[0]?.thumb || '',
    formats: [
      {
        quality: '720p HD',
        url: mainUrl,
        ext: 'mp4',
        formatId: '720p',
        needProxy: false,
      },
      {
        quality: '480p SD',
        url: mainUrl,
        ext: 'mp4',
        formatId: '480p',
        needProxy: false,
      }
    ],
  } as unknown as VideoData;
}
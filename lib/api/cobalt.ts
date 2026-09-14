import type { Platform, VideoData } from '../types';

export async function extractWithCobalt(url: string, platform: Platform): Promise<VideoData> {
  const res = await fetch('https://api.cobalt.tools/api/json', {
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

  if (!res.ok) {
    throw new Error(`Cobalt returned status ${res.status}`);
  }

  const data = await res.json();

  if (data.status === 'error') {
    throw new Error(data.error?.code || 'Cobalt extraction failed');
  }

  const downloadUrl = data.url;

  if (!downloadUrl && (!data.picker || data.picker.length === 0)) {
    throw new Error('No download link found from Cobalt');
  }

  const mainUrl = downloadUrl || data.picker?.[0]?.url;

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
      },
      {
        quality: '480p SD',
        url: mainUrl,
        ext: 'mp4',
      }
    ],
  };
}
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n >= 10 || i === 0 ? Math.round(n) : n.toFixed(1)} ${units[i]}`;
}

export function formatDuration(seconds?: number): string {
  if (seconds == null || !isFinite(seconds) || seconds < 0) return '';
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

/** Tiny stable hash for ids when the source doesn't provide one. */
export function hashId(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i += 1) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  }
  return `v${(h >>> 0).toString(36)}`;
}

export function heightToQuality(height: number): string {
  if (height >= 2160) return '4k';
  if (height >= 1080) return '1080p';
  if (height >= 720) return '720p';
  if (height >= 480) return '480p';
  if (height >= 360) return '360p';
  if (height > 0) return `${height}p`;
  return 'hd';
}

/** Normalize any upstream quality string into our canonical buckets. */
export function normalizeQuality(raw: string | number | null | undefined): string {
  if (raw == null) return 'hd';
  const s = String(raw).toLowerCase().trim();
  if (!s) return 'hd';
  const dim = s.match(/(\d{3,5})\s*[x×]\s*\d{2,5}/);
  if (dim) return heightToQuality(parseInt(dim[1], 10));
  if (s.includes('4k') || s.includes('2160') || s.includes('uhd')) return '4k';
  if (s.includes('1080')) return '1080p';
  if (s.includes('720')) return '720p';
  if (s.includes('480')) return '480p';
  if (s.includes('360')) return '360p';
  const bare = s.match(/^(\d{3,5})p?$/);
  if (bare) return heightToQuality(parseInt(bare[1], 10));
  if (s.includes('mp3') || s.includes('audio') || s === 'music' || s === 'm4a' || s === 'opus' || s === 'aac') return 'mp3';
  if (s.includes('3d')) return '4k';
  return 'hd';
}

export function qualityLabel(quality: string): string {
  switch (quality) {
    case '4k':
      return '4K Ultra HD';
    case '1080p':
      return 'Full HD 1080p';
    case '720p':
      return 'HD 720p';
    case '480p':
      return 'SD 480p';
    case '360p':
      return '360p';
    case 'mp3':
      return 'MP3 Audio';
    case 'hd':
      return 'Best Quality';
    default:
      return quality.replace('p', 'p').toUpperCase();
  }
}

export const QUALITY_ORDER: Record<string, number> = {
  '4k': 0,
  '1080p': 1,
  '720p': 2,
  '480p': 3,
  '360p': 4,
  hd: 5,
  mp3: 9,
};

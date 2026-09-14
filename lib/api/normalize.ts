import type { Platform, Provider, VideoData, VideoFormat } from '../types';
import { QUALITY_ORDER, formatBytes, formatDuration, hashId, normalizeQuality, qualityLabel } from '../utils';

type AnyObj = Record<string, unknown>;

export function isObj(v: unknown): v is AnyObj {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function asStr(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : undefined;
}

export function asNum(v: unknown): number | undefined {
  if (typeof v === 'number' && isFinite(v)) return v;
  if (typeof v === 'string' && /^\d+(\.\d+)?$/.test(v.trim())) return parseFloat(v);
  return undefined;
}

/** Breadth-first walk so shallow (top-level) keys win over deeply nested ones. */
function walk(node: unknown, depth: number, visit: (obj: AnyObj) => void): void {
  if (depth > 7 || node == null) return;
  if (Array.isArray(node)) {
    for (const child of node) walk(child, depth + 1, visit);
    return;
  }
  if (isObj(node)) {
    visit(node);
    for (const child of Object.values(node)) walk(child, depth + 1, visit);
  }
}

function firstStr(root: unknown, keys: string[]): string | undefined {
  let found: string | undefined;
  walk(root, 0, (obj) => {
    if (found) return;
    for (const k of keys) {
      const s = asStr(obj[k]);
      if (s && s.length < 500) {
        found = s;
        return;
      }
    }
  });
  return found;
}

function firstNum(root: unknown, keys: string[]): number | undefined {
  let found: number | undefined;
  walk(root, 0, (obj) => {
    if (found != null) return;
    for (const k of keys) {
      const n = asNum(obj[k]);
      if (n != null && n > 0) {
        found = n;
        return;
      }
    }
  });
  return found;
}

interface RawFormat {
  kind: 'video' | 'audio';
  quality: string | number | null | undefined;
  size?: number;
  ext?: string;
  url: string;
}

const FORMAT_ARRAY_KEYS = ['formats', 'links_list', 'linksList', 'download_links', 'downloadLinks', 'files', 'variants', 'qualities', 'formats_list'];
const LINK_MAP_KEYS = ['links', 'qualities', 'resolutions', 'formats'];
const SINGLE_LINK_KEYS: Array<[string, 'video' | 'audio']> = [
  ['download_url', 'video'],
  ['downloadUrl', 'video'],
  ['video_url', 'video'],
  ['videoUrl', 'video'],
  ['mp4_url', 'video'],
  ['mp4Url', 'video'],
  ['audio_url', 'audio'],
  ['audioUrl', 'audio'],
  ['mp3_url', 'audio'],
  ['mp3Url', 'audio'],
];

function looksLikeFormatArray(arr: unknown[]): boolean {
  return arr.some((item) => {
    if (!isObj(item)) return false;
    return !!(asStr(item.url) || asStr(item.link) || asStr(item.file) || asStr(item.download_url) || asStr(item.downloadLink));
  });
}

/** Tolerant extractor: handles the many response shapes RapidAPI products use. */
function extractFormats(root: unknown): VideoFormat[] {
  const out: VideoFormat[] = [];
  const seen = new Set<string>();

  const push = (raw: RawFormat) => {
    const quality = normalizeQuality(raw.quality);
    const key = `${raw.kind}:${quality}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({
      id: `${raw.kind}-${quality}`,
      kind: raw.kind,
      quality,
      label: qualityLabel(quality),
      ext: raw.ext || (raw.kind === 'audio' ? 'mp3' : 'mp4'),
      size: raw.size,
      sizeLabel: raw.size ? formatBytes(raw.size) : undefined,
      url: raw.url,
    });
  };

  walk(root, 0, (obj) => {
    // 1) arrays of format objects
    for (const key of FORMAT_ARRAY_KEYS) {
      const v = obj[key];
      if (!Array.isArray(v) || !looksLikeFormatArray(v)) continue;
      for (const item of v) {
        if (!isObj(item)) continue;
        const url = asStr(item.url) || asStr(item.link) || asStr(item.file) || asStr(item.download_url) || asStr(item.downloadLink);
        if (!url || !/^https?:\/\//i.test(url)) continue;
        const ext = asStr(item.ext) || asStr(item.extension);
        const kindHint = asStr(item.kind) || asStr(item.type) || '';
        const isAudio = rawIsAudio(item, ext, kindHint);
        push({
          kind: isAudio ? 'audio' : 'video',
          quality:
            asStr(item.quality) ||
            asStr(item.resolution) ||
            asStr(item.height) ||
            asStr(item.label) ||
            asStr(item.name) ||
            asStr(item.format),
          size: asNum(item.size) ?? asNum(item.filesize) ?? asNum(item.fileSize) ?? asNum(item.file_size) ?? asNum(item.size_bytes) ?? asNum(item.file_size_bytes),
          ext,
          url,
        });
      }
    }

    // 2) map of { "1080p": "https://..." }
    for (const key of LINK_MAP_KEYS) {
      const v = obj[key];
      if (!isObj(v)) continue;
      const entries = Object.entries(v).filter(([, val]) => asStr(val)?.startsWith('http'));
      if (entries.length < 1 || entries.length > 16) continue;
      for (const [k, val] of entries) {
        push({
          kind: /mp3|audio|m4a/i.test(k) ? 'audio' : 'video',
          quality: k,
          url: val as string,
        });
      }
    }

    // 3) single direct links
    for (const [key, kind] of SINGLE_LINK_KEYS) {
      const u = asStr(obj[key]);
      if (u && /^https?:\/\//i.test(u)) {
        push({ kind, quality: kind === 'audio' ? 'mp3' : 'hd', url: u });
      }
    }
  });

  out.sort((a, b) => (QUALITY_ORDER[a.quality] ?? 8) - (QUALITY_ORDER[b.quality] ?? 8));
  return out;
}

function rawIsAudio(item: AnyObj, ext: string | undefined, kindHint: string): boolean {
  if (item.kind === 'audio' || item.type === 'audio') return true;
  if (ext === 'mp3' || ext === 'm4a' || ext === 'opus' || ext === 'aac' || ext === 'ogg') return true;
  return /mp3|audio/i.test(kindHint);
}

/**
 * Build a VideoData object from an arbitrary API response.
 * Returns null when the response contains no usable metadata or links.
 */
export function buildVideoFromRoot(
  root: unknown,
  sourceUrl: string,
  platform: Platform,
  provider: Provider
): VideoData | null {
  const formats = extractFormats(root);
  const title = firstStr(root, ['title', 'video_title', 'videoTitle', 'name', 'caption']);
  const author = firstStr(root, ['author', 'channel', 'uploader', 'owner', 'username', 'artist', 'author_name']);
  const thumbnail = firstStr(root, ['thumbnail', 'thumbnail_url', 'thumbnailUrl', 'thumb', 'image', 'cover', 'preview']);
  const duration = firstNum(root, ['duration', 'lengthSeconds', 'length', 'video_duration', 'videoDuration', 'time', 'seconds']);
  const id = firstStr(root, ['id', 'video_id', 'videoId', 'entry_id']);

  if (!title && !thumbnail && formats.length === 0) return null;

  return {
    id: id || hashId(sourceUrl),
    platform,
    sourceUrl,
    title: title || 'Untitled video',
    author,
    thumbnail,
    duration,
    durationLabel: duration != null ? formatDuration(duration) : undefined,
    provider,
    demo: false,
    formats,
  };
}

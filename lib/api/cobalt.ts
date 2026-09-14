import type { Platform, VideoData, VideoFormat } from '../types';
import { hashId } from '../utils';

/**
 * Cobalt-compatible API client (https://github.com/imputnet/cobalt).
 *
 * Cobalt is the only free download backend that works from Vercel serverless:
 * it returns short-lived "tunnel" URLs, so the actual file flows directly
 * from the cobalt instance to the user's browser — never through Vercel
 * (no 4.5MB body limit, no bandwidth issue, no bot-check on Vercel's IPs).
 *
 * The official api.cobalt.tools requires an API key now, so we default to
 * community instances that still allow unauthenticated use. Override or add
 * more with the COBALT_INSTANCES env var (comma-separated, tried in order).
 * If your instance requires an API key, set COBALT_API_KEY.
 */

const DEFAULT_INSTANCES = ['https://co.otomir23.me'];
const TIMEOUT_MS = 20000;

const AUDIO_EXTS = new Set(['mp3', 'm4a', 'ogg', 'opus', 'wav', 'aac', 'flac']);

type CobaltStatus = 'tunnel' | 'redirect' | 'stream' | 'picker' | 'success' | 'error' | 'rate-limit';

interface CobaltPickerItem {
  type?: string;
  url?: string;
  thumb?: string;
}

interface CobaltResponse {
  status: CobaltStatus;
  url?: string;
  filename?: string;
  audio?: string;
  audioFilename?: string;
  picker?: CobaltPickerItem[];
  error?: { code?: string };
}

function getInstances(): string[] {
  const fromEnv = (process.env.COBALT_INSTANCES || '')
    .split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : DEFAULT_INSTANCES;
}

function extFromFilename(filename: string | undefined, fallback: string): string {
  const m = filename?.match(/\.([a-z0-9]{2,5})$/i);
  return m ? m[1].toLowerCase() : fallback;
}

function titleFromFilename(filename?: string): string | undefined {
  if (!filename) return undefined;
  const base = filename.replace(/\.[a-z0-9]{2,5}$/i, '').trim();
  return base.length > 0 ? base : undefined;
}

async function callCobalt(base: string, body: Record<string, unknown>, apiKey?: string): Promise<CobaltResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (apiKey) headers.Authorization = `Api-Key ${apiKey}`;
    const res = await fetch(`${base}/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => null)) as CobaltResponse | null;
    if (!res.ok || !data) throw new Error(`HTTP ${res.status}`);
    if (data.status === 'error' || data.status === 'rate-limit') {
      throw new Error(data.error?.code || `cobalt ${data.status}`);
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

function singleToFormat(data: CobaltResponse): VideoFormat | null {
  if (!data.url) return null;
  const ext = extFromFilename(data.filename, 'mp4');
  const isAudio = AUDIO_EXTS.has(ext);
  return {
    id: isAudio ? 'audio-best' : 'video-best',
    kind: isAudio ? 'audio' : 'video',
    quality: isAudio ? 'mp3' : 'hd',
    label: isAudio ? `${ext.toUpperCase()} Audio` : 'Best Quality MP4',
    ext,
    url: data.url,
  };
}

export async function extractWithCobalt(url: string, platform: Platform): Promise<VideoData | null> {
  const instances = getInstances();
  const apiKey = process.env.COBALT_API_KEY || undefined;
  let lastError: unknown = null;

  for (const base of instances) {
    try {
      // Video (best quality) and audio (mp3) are requested in parallel;
      // audio silently skips when the service/media can't provide it.
      const [videoRes, audioRes] = await Promise.all([
        callCobalt(base, { url, downloadMode: 'auto', filenameStyle: 'basic' }, apiKey),
        callCobalt(base, { url, downloadMode: 'audio', filenameStyle: 'basic' }, apiKey).catch(() => null),
      ]);

      const formats: VideoFormat[] = [];
      const seen = new Set<string>();
      const push = (f: VideoFormat | null) => {
        if (!f || seen.has(f.url)) return;
        seen.add(f.url);
        formats.push(f);
      };

      if (videoRes.status === 'picker' && Array.isArray(videoRes.picker) && videoRes.picker.length > 0) {
        videoRes.picker.forEach((item, i) => {
          if (!item?.url) return;
          const isPhoto = item.type === 'photo';
          push({
            id: `media-${i}`,
            kind: 'video',
            quality: 'hd',
            label: videoRes.picker!.length > 1 ? `Media ${i + 1}` : 'Best Quality',
            ext: isPhoto ? 'jpg' : 'mp4',
            url: item.url!,
          });
        });
        if (videoRes.audio) {
          push({ id: 'audio-mp3', kind: 'audio', quality: 'mp3', label: 'MP3 Audio', ext: extFromFilename(videoRes.audioFilename, 'mp3'), url: videoRes.audio });
        }
      } else {
        push(singleToFormat(videoRes));
      }

      if (audioRes && audioRes.url) {
        push({ id: 'audio-mp3', kind: 'audio', quality: 'mp3', label: 'MP3 Audio', ext: extFromFilename(audioRes.filename, 'mp3'), url: audioRes.url });
      }

      if (formats.length === 0) throw new Error('cobalt returned no download links');

      return {
        id: hashId(url),
        platform,
        sourceUrl: url,
        title: titleFromFilename(videoRes.filename) || titleFromFilename(audioRes?.filename) || 'Untitled video',
        provider: 'cobalt',
        demo: false,
        formats,
      };
    } catch (e) {
      lastError = e;
      console.error(`[snaplink] cobalt instance ${base} failed:`, e instanceof Error ? e.message : e);
    }
  }

  if (lastError) throw lastError;
  return null;
}

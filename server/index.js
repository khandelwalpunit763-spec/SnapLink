/**
 * SnapLink — self-hosted download API (Option B)
 * ------------------------------------------------
 * A tiny Express service that uses yt-dlp (+ ffmpeg) to extract metadata
 * and stream the final file. Run it on a VPS / Railway / Fly.io and point
 * the Next.js app at it with DOWNLOADER_API_URL.
 *
 * Why self-host?
 *  - yt-dlp needs a real binary + long jobs, which Vercel serverless can't run.
 *  - The file is streamed from YOUR server's IP, so end-users' IPs are never
 *    exposed/blocked by source sites.
 *
 * Requirements: node 18+, yt-dlp and ffmpeg on PATH (the Dockerfile handles both).
 *
 *   POST /api/extract  { "url": "https://..." }  ->  { video: VideoData }
 *   GET  /api/stream   ?url=...&q=1080p|720p|480p|4k|mp3  ->  file bytes
 *   GET  /health                                    ->  { ok: true }
 */

const express = require('express');
const { spawn } = require('node:child_process');

const app = express();
const PORT = process.env.PORT || 8787;

app.use(express.json());

/* CORS — the Next.js frontend lives on a different origin (Vercel). */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const QUALITY_SELECTORS = {
  '4k': 'bestvideo[height<=2160][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=2160]+bestaudio/best[height<=2160]',
  '1080p': 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=1080]+bestaudio/best[height<=1080]',
  '720p': 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=720]+bestaudio/best[height<=720]',
  '480p': 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=480]+bestaudio/best[height<=480]',
};
const MAX_HEIGHT = { '4k': 2160, '1080p': 1080, '720p': 720, '480p': 480 };
const QUALITY_LABEL = { '4k': '4K Ultra HD', '1080p': 'Full HD 1080p', '720p': 'HD 720p', '480p': 'SD 480p' };

function runYtDlp(args, { timeoutMs = 60000, onStdoutData } = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn('yt-dlp', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      reject(new Error('yt-dlp timed out'));
    }, timeoutMs);
    proc.stdout.on('data', (d) => {
      if (onStdoutData) onStdoutData(d);
      else stdout += d.toString();
    });
    proc.stderr.on('data', (d) => {
      stderr += d.toString();
    });
    proc.on('error', (e) => {
      clearTimeout(timer);
      reject(e);
    });
    proc.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(stderr.slice(-400) || `yt-dlp exited with code ${code}`));
    });
  });
}

function detectPlatform(url) {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^(www|m|mobile|music)\./, '');
    if (host.endsWith('youtube.com') || host === 'youtu.be' || host === 'youtube-nocookie.com') return 'youtube';
    if (host === 'instagram.com') return 'instagram';
    if (host === 'facebook.com' || host === 'fb.com' || host === 'fb.watch') return 'facebook';
    if (host === 'twitter.com' || host === 'x.com') return 'twitter';
    return 'youtube';
  } catch {
    return 'youtube';
  }
}

function fmtDuration(sec) {
  if (sec == null) return undefined;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

function requestOrigin(req) {
  const proto = (req.get('x-forwarded-proto') || req.protocol || 'http').split(',')[0].trim();
  return `${proto}://${req.get('host')}`;
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'snaplink-apidlp', version: '1.0.0' });
});

/* ---------- metadata + quality list ---------- */
app.post('/api/extract', async (req, res) => {
  const { url } = req.body || {};
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url) || url.length > 2048) {
    return res.status(400).json({ error: 'Invalid url' });
  }

  try {
    const { stdout } = await runYtDlp(
      ['-J', '--no-playlist', '--user-agent', UA, url],
      { timeoutMs: 45000 }
    );
    const info = JSON.parse(stdout);
    const origin = requestOrigin(req);
    const heights = new Set((info.formats || []).map((f) => f.height).filter(Boolean));

    const formats = Object.keys(QUALITY_SELECTORS)
      .filter((q) => heights.some((h) => h <= MAX_HEIGHT[q]))
      .map((q) => ({
        id: `video-${q}`,
        kind: 'video',
        quality: q,
        label: QUALITY_LABEL[q],
        ext: 'mp4',
        url: `${origin}/api/stream?url=${encodeURIComponent(url)}&q=${q}`,
      }));
    formats.push({
      id: 'audio-mp3',
      kind: 'audio',
      quality: 'mp3',
      label: 'MP3 Audio',
      ext: 'mp3',
      url: `${origin}/api/stream?url=${encodeURIComponent(url)}&q=mp3`,
    });

    res.json({
      video: {
        id: String(info.id || ''),
        platform: detectPlatform(url),
        sourceUrl: url,
        title: info.title || 'Untitled video',
        author: info.uploader || info.channel || info.uploader_id || undefined,
        thumbnail: info.thumbnail || undefined,
        duration: info.duration ?? undefined,
        durationLabel: fmtDuration(info.duration),
        provider: 'self-api',
        demo: false,
        formats,
      },
    });
  } catch (e) {
    console.error('[extract]', e.message);
    res.status(502).json({ error: 'Could not extract this video: ' + e.message.slice(0, 200) });
  }
});

/* ---------- final file stream (download trigger) ---------- */
app.get('/api/stream', async (req, res) => {
  const url = req.query.url;
  const q = String(req.query.q || '1080p');

  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return res.status(400).json({ error: 'Invalid url' });

  let args;
  let contentType;
  let filename;
  if (q === 'mp3') {
    args = ['-o', 'pipe:1', '-x', '--audio-format', 'mp3', '--audio-quality', '192K', '--no-playlist', '--user-agent', UA, url];
    contentType = 'audio/mpeg';
    filename = 'snaplink-audio.mp3';
  } else if (QUALITY_SELECTORS[q]) {
    args = ['-o', 'pipe:1', '-N', '4', '--no-part', '-f', QUALITY_SELECTORS[q], '--no-playlist', '--user-agent', UA, url];
    contentType = 'video/mp4';
    filename = `snaplink-${q}.mp4`;
  } else {
    return res.status(400).json({ error: 'Unknown quality' });
  }

  let started = false;
  try {
    await new Promise((resolve, reject) => {
      const proc = spawn('yt-dlp', args, { stdio: ['ignore', 'pipe', 'pipe'] });
      let stderr = '';
      const timer = setTimeout(() => {
        proc.kill('SIGKILL');
        reject(new Error('timed out'));
      }, 180000);

      proc.stdout.on('data', (d) => {
        if (!started) {
          started = true;
          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
          res.setHeader('Cache-Control', 'no-store');
        }
        res.write(d);
      });
      proc.stderr.on('data', (d) => {
        stderr += d.toString();
      });
      proc.on('error', reject);
      proc.on('close', (code) => {
        clearTimeout(timer);
        if (code === 0) resolve();
        else reject(new Error(stderr.slice(-300) || `exit ${code}`));
      });
    });
    res.end();
  } catch (e) {
    console.error('[stream]', e.message);
    if (!started) res.status(502).json({ error: 'Download failed: ' + e.message.slice(0, 200) });
    else res.end();
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SnapLink API listening on :${PORT}`);
});

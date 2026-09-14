import { NextResponse, type NextRequest } from 'next/server';
import { extractVideo } from '@/lib/api';
import { detectPlatform, resolveShortLink } from '@/lib/detectPlatform';
import type { DownloadResponse } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const MAX_URL_LENGTH = 2048;

function bad(message: string, status: 400 | 422 | 502): NextResponse {
  const body: DownloadResponse = { success: false, error: message };
  return NextResponse.json(body, { status });
}

export async function POST(req: NextRequest) {
  let raw: string;
  try {
    const body = (await req.json()) as { url?: unknown };
    raw = typeof body.url === 'string' ? body.url.trim() : '';
  } catch {
    return bad('Invalid request body.', 400);
  }

  if (!raw) return bad('Please paste a video link first.', 400);
  if (raw.length > MAX_URL_LENGTH) return bad('Link is too long (max 2048 characters).', 400);
  if (!/^https?:\/\//i.test(raw)) return bad('Links must start with http:// or https://.', 400);

  try {
    // Resolve t.co short links before platform detection
    const url = await resolveShortLink(raw);
    const platform = detectPlatform(url);
    if (!platform) {
      return bad('Unsupported link. SnapLink works with YouTube, Instagram, Facebook and X (Twitter) videos.', 422);
    }

    const video = await extractVideo(url, platform);
    const body: DownloadResponse = { success: true, video };
    return NextResponse.json(body);
  } catch (err) {
    console.error('[snaplink] extract failed:', err instanceof Error ? err.message : err);
    return bad('Could not fetch this video right now — the platform may be rate-limiting. Please try again in a few seconds.', 502);
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: 'SnapLink', docs: '/api' });
}

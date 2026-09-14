'use client';

import { useRef, useState } from 'react';
import { AlertTriangle, ClipboardPaste, Download, Link2, Loader2 } from 'lucide-react';
import { detectPlatform, PLATFORM_LABELS } from '@/lib/detectPlatform';
import type { DownloadResponse, VideoData } from '@/lib/types';
import { PlatformIcon } from './PlatformIcon';
import PreviewCard from './PreviewCard';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  /** true when no API key is configured server-side — shows a subtle demo hint */
  showDemoHint?: boolean;
}

export default function Downloader({ showDemoHint = false }: Props) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [video, setVideo] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pasteHint, setPasteHint] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const platform = value.trim() ? detectPlatform(value) : null;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setValue(text.trim());
        setPasteHint(null);
        inputRef.current?.focus();
      } else {
        setPasteHint('Clipboard is empty — copy a video link first.');
      }
    } catch {
      setPasteHint('Browser blocked the clipboard — paste manually with Ctrl+V / ⌘V.');
    }
  };

  const handleDownload = async () => {
    const url = value.trim();
    if (!detectPlatform(url)) {
      setStatus('error');
      setError('Please paste a valid link from YouTube, Instagram, Facebook or X (Twitter).');
      return;
    }
    setStatus('loading');
    setVideo(null);
    setError(null);
    setPasteHint(null);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 35000);
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });
      const data = (await res.json()) as DownloadResponse;
      if (!res.ok || !data.success || !data.video) throw new Error(data.error || 'Failed to fetch video details.');
      setVideo(data.video);
      setStatus('success');
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    } catch (e) {
      const msg =
        e instanceof DOMException && e.name === 'AbortError'
          ? 'This took too long — the source may be rate-limiting. Please try again in a few seconds.'
          : e instanceof Error
            ? e.message
            : 'Something went wrong. Please try again.';
      setError(msg);
      setStatus('error');
    } finally {
      clearTimeout(timer);
    }
  };

  const reset = () => {
    setValue('');
    setVideo(null);
    setStatus('idle');
    setError(null);
    setPasteHint(null);
    inputRef.current?.focus();
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-3xl">
      {/* Input card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-2xl shadow-blue-950/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-blue-500/5 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Link2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              inputMode="url"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (status === 'error') setStatus('idle');
                if (pasteHint) setPasteHint(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDownload();
              }}
              placeholder="Paste a YouTube, Instagram, Facebook or X link…"
              aria-label="Video URL"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-24 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 sm:h-13 sm:text-base dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500"
            />
            {platform && (
              <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <PlatformIcon name={platform} className="h-3.5 w-3.5" />
                {PLATFORM_LABELS[platform]}
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePaste}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600 sm:h-13 sm:flex-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
            >
              <ClipboardPaste className="h-4 w-4" aria-hidden="true" />
              Paste
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={status === 'loading'}
              className="flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:h-13 dark:shadow-blue-950/50"
            >
              {status === 'loading' ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="h-5 w-5" aria-hidden="true" />
              )}
              {status === 'loading' ? 'Fetching…' : 'Download'}
            </button>
          </div>
        </div>

        {pasteHint && (
          <p className="mt-2.5 flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {pasteHint}
          </p>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
        Works with youtube.com · youtu.be · instagram.com/reel · facebook.com · x.com &amp; fb.watch links
      </p>
      {showDemoHint && status === 'idle' && (
        <p className="mt-1.5 text-center text-xs text-slate-400 dark:text-slate-500">
          Running in demo mode — metadata is real; connect your API key to unlock download links (README → API setup).
        </p>
      )}

      {/* Results */}
      <div ref={resultRef} className="mt-6 scroll-mt-28">
        {status === 'loading' && <LoadingCard />}
        {status === 'success' && video && <PreviewCard video={video} onReset={reset} />}
        {status === 'error' && (
          <div className="animate-fade-up rounded-2xl border border-red-200 bg-red-50/80 p-5 dark:border-red-500/30 dark:bg-red-500/10">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-500">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">Couldn&apos;t process this link</p>
                <p className="mt-1 text-sm text-red-600/90 dark:text-red-300/80">{error}</p>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-3 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="animate-fade-up rounded-2xl border border-slate-200/80 bg-white/90 p-5 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-3 text-sm font-semibold text-blue-600 dark:text-blue-400">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Fetching video details…
        <span className="text-xs font-normal text-slate-400">detecting platform · grabbing metadata · preparing formats</span>
      </div>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        <div className="aspect-video w-full shrink-0 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800 sm:h-28 sm:w-44" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

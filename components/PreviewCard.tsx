'use client';

import { useState } from 'react';
import { Check, Copy, ExternalLink, Film, Lock, Music, RefreshCw, ShieldCheck } from 'lucide-react';
import type { VideoData } from '@/lib/types';
import { cn, qualityLabel } from '@/lib/utils';
import AdSlot from './AdSlot';
import { PlatformChip, PlatformIcon } from './PlatformIcon';

interface Props {
  video: VideoData;
  onReset: () => void;
}

const DEMO_QUALITIES = ['1080p', '720p', '480p', 'mp3'] as const;

export default function PreviewCard({ video, onReset }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      window.prompt('Copy this direct link:', url);
    }
  };

  return (
    <article className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl shadow-blue-950/5 dark:border-slate-800 dark:bg-slate-900/85">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5">
        {/* Thumbnail */}
        <div className="relative w-full shrink-0 sm:w-64">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="aspect-video w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <PlatformIcon name={video.platform} className="h-12 w-12 text-slate-300 dark:text-slate-600" />
            </div>
          )}
          {video.durationLabel && (
            <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-bold text-white">
              {video.durationLabel}
            </span>
          )}
          <span className="absolute left-2 top-2">
            <PlatformChip platform={video.platform} />
          </span>
        </div>

        {/* Details + formats */}
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 dark:text-white sm:text-lg" title={video.title}>
            {video.title}
          </h3>
          {video.author && <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{video.author}</p>}

          {video.demo && (
            <div className="mt-3 rounded-xl border border-amber-300/70 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
              <p className="text-xs font-bold uppercase tracking-wider">Demo mode</p>
              <p className="mt-1 leading-relaxed">{video.message}</p>
            </div>
          )}

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Choose quality</p>
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                <RefreshCw className="h-3 w-3" aria-hidden="true" />
                New link
              </button>
            </div>

            {video.formats.length > 0 ? (
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {video.formats.map((f, i) => (
                  <div key={f.id} className="flex gap-2">
                    <a
                      href={f.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition',
                        i === 0
                          ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:text-blue-400'
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        {f.kind === 'audio' ? (
                          <Music className="h-4 w-4 shrink-0" aria-hidden="true" />
                        ) : (
                          <Film className="h-4 w-4 shrink-0" aria-hidden="true" />
                        )}
                        <span className="truncate">
                          {f.label}
                          {f.sizeLabel && <span className="ml-1.5 text-xs font-normal opacity-70">{f.sizeLabel}</span>}
                        </span>
                      </span>
                      <span className="shrink-0 text-[10px] font-bold uppercase opacity-60">{f.ext}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copy(f.url, f.id)}
                      title="Copy direct link"
                      aria-label="Copy direct link"
                      className="flex h-[42px] w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
                    >
                      {copiedId === f.id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* Demo mode — show the quality grid locked, with a working "open source" action */
              <>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {DEMO_QUALITIES.map((q) => (
                    <div
                      key={q}
                      className="flex items-center justify-between rounded-xl border border-dashed border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-400 dark:border-slate-700 dark:text-slate-500"
                    >
                      <span className="flex items-center gap-2">
                        {q === 'mp3' ? <Music className="h-4 w-4" aria-hidden="true" /> : <Film className="h-4 w-4" aria-hidden="true" />}
                        {qualityLabel(q)}
                      </span>
                      <Lock className="h-4 w-4" aria-hidden="true" />
                    </div>
                  ))}
                </div>
                <a
                  href={video.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-blue-500/40 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Open source video (demo)
                </a>
              </>
            )}

            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
              Direct download · No sign-up · No watermark · No forced redirects
            </p>
          </div>
        </div>
      </div>

      {/* Ad slot below download buttons */}
      <div className="border-t border-slate-200/70 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/40">
        <AdSlot position="results" />
      </div>
    </article>
  );
}

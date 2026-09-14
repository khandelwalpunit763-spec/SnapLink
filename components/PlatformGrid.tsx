import { PLATFORM_META } from './PlatformIcon';
import type { Platform } from '@/lib/types';

const PLATFORMS: Array<{ platform: Platform; name: string; desc: string; chips: string[] }> = [
  { platform: 'youtube', name: 'YouTube', desc: 'Videos, Shorts & Music — download in up to 4K or rip the audio as MP3.', chips: ['Videos', 'Shorts', 'Music'] },
  { platform: 'instagram', name: 'Instagram', desc: 'Save Reels, Posts & IGTV clips in clean quality — no watermark, no username overlay.', chips: ['Reels', 'Posts', 'IGTV'] },
  { platform: 'facebook', name: 'Facebook', desc: 'Grab Facebook Videos, Reels & Watch clips before they disappear from the feed.', chips: ['Videos', 'Reels', 'Watch'] },
  { platform: 'twitter', name: 'X (Twitter)', desc: 'Download video posts & clips from X — including short links (t.co) pasted straight from the app.', chips: ['Posts', 'Clips', 't.co'] },
];

export default function PlatformGrid() {
  return (
    <section id="platforms" className="scroll-mt-24 border-y border-slate-200/60 bg-white/60 dark:border-slate-800/60 dark:bg-slate-900/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Supported platforms</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            One link box. Four platforms.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
            Smart link detection recognises the platform automatically — just paste and go.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORMS.map((p) => {
            const { icon: Icon, color, soft } = PLATFORM_META[p.platform];
            return (
              <div
                key={p.platform}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-600/5 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-blue-500/40"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${soft} ${color}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-bold text-slate-900 dark:text-white">{p.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{p.desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

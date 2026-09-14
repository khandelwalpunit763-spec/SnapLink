import { Zap } from 'lucide-react';
import AdSlot from './AdSlot';
import { PLATFORM_META } from './PlatformIcon';
import type { Platform } from '@/lib/types';

const PLATFORMS: Platform[] = ['youtube', 'instagram', 'facebook', 'twitter'];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-white dark:border-slate-800/60 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500">
                <Zap className="h-5 w-5 text-white" fill="currentColor" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Snap<span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">Link</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Download High Quality Videos &amp; Audio in Seconds — YouTube, Instagram Reels, Facebook &amp; X.
            </p>
            <div className="mt-4 flex gap-2">
              {PLATFORMS.map((p) => {
                const { icon: Icon, color, soft } = PLATFORM_META[p];
                return (
                  <span key={p} className={`flex h-9 w-9 items-center justify-center rounded-lg ${soft} ${color}`}>
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ['#how', 'How it works'],
                ['#platforms', 'Supported platforms'],
                ['#features', 'Features'],
                ['#guide', 'Download guide'],
                ['#faq', 'FAQ'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-slate-600 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Good to know</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>100% free · no sign-up · no watermark</li>
              <li>Up to 4K video &amp; MP3 audio</li>
              <li>Your links are processed and forgotten — nothing is stored</li>
              <li className="text-xs text-slate-400 dark:text-slate-500">
                SnapLink does not host any videos. Please respect copyright — download only content you own or that is
                licensed for offline use.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <AdSlot position="footer" />
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200/60 pt-6 text-xs text-slate-500 sm:flex-row dark:border-slate-800/60 dark:text-slate-400">
          <p>© {new Date().getFullYear()} SnapLink. All rights reserved.</p>
          <p>
            Made with <span className="text-emerald-500">♥</span> for fast, clean downloads.
          </p>
        </div>
      </div>
    </footer>
  );
}

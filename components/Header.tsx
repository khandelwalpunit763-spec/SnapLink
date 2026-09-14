'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const NAV = [
  { href: '#how', label: 'How it works' },
  { href: '#platforms', label: 'Platforms' },
  { href: '#features', label: 'Features' },
  { href: '#faq', label: 'FAQ' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="SnapLink home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-lg shadow-blue-600/25">
            <Zap className="h-5 w-5 text-white" fill="currentColor" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Snap
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">Link</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 sm:inline-block dark:text-emerald-400">
            100% Free
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

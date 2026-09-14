'use client';

import { useEffect } from 'react';

export type AdPosition = 'header' | 'results' | 'footer';

const META: Record<AdPosition, { label: string; placeholderMin: number }> = {
  header: { label: '728 × 90 leaderboard / responsive', placeholderMin: 56 },
  results: { label: 'responsive in-content', placeholderMin: 84 },
  footer: { label: '728 × 90 leaderboard / responsive', placeholderMin: 56 },
};

/**
 * Google AdSense slot.
 * Set NEXT_PUBLIC_ADSENSE_CLIENT (+ per-position slot env vars) to render real
 * ads — otherwise a subtle labelled placeholder keeps the layout stable.
 */
export default function AdSlot({ position, className = '' }: { position: AdPosition; className?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client) return;
    if (!document.getElementById('adsense-script')) {
      const s = document.createElement('script');
      s.id = 'adsense-script';
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      s.crossOrigin = 'anonymous';
      document.head.appendChild(s);
    }
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      /* ads blocked */
    }
  }, [client]);

  if (client) {
    return (
      <div className={`flex justify-center ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: 90 }}
          data-ad-client={client}
          data-ad-slot={process.env[`NEXT_PUBLIC_ADSENSE_SLOT_${position.toUpperCase()}`] ?? ''}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`mx-auto flex w-full max-w-[728px] items-center justify-center rounded-lg border border-dashed border-slate-300/80 px-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:border-slate-700/80 dark:text-slate-600 ${className}`}
      style={{ minHeight: META[position].placeholderMin }}
    >
      Advertisement · {META[position].label}
    </div>
  );
}

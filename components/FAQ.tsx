import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Is SnapLink really free?',
    a: 'Yes — 100% free, no premium tiers, no sign-up and no daily limits. SnapLink is a simple utility: paste a link, pick a quality, download.',
  },
  {
    q: 'Which platforms does SnapLink support?',
    a: 'YouTube (videos, Shorts and Music), Instagram (Reels, Posts and IGTV), Facebook (Videos, Reels and Watch clips) and X/Twitter (video posts and t.co short links).',
  },
  {
    q: 'What is the highest quality I can download?',
    a: 'Up to 4K when the source video offers it. SnapLink also lists Full HD 1080p, HD 720p and SD 480p, plus an MP3 audio option — only formats that actually exist for that video are shown.',
  },
  {
    q: 'Can I download audio only (MP3)?',
    a: 'Yes. After you paste a link, choose the “MP3 Audio” option in the preview card to save just the soundtrack of the video.',
  },
  {
    q: 'Why do I see “Demo mode” on the result card?',
    a: 'Demo mode means no download API is connected to this deployment yet. Metadata (title, thumbnail, duration) is still real — open README.md → API setup to add your RapidAPI key or self-hosted API, then download links unlock automatically.',
  },
  {
    q: 'Does SnapLink work on mobile?',
    a: 'Absolutely. The interface is fully responsive — use it directly in your phone browser. Use the Paste button to pull the link straight from your clipboard.',
  },
  {
    q: 'Is downloading videos legal?',
    a: 'SnapLink is a tool. You are responsible for respecting copyright: only download content you own, that is licensed for offline use, or that is in the public domain. Do not use it to pirate or re-upload others’ content.',
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-slate-200/60 bg-white/60 dark:border-slate-800/60 dark:bg-slate-900/30">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">FAQ</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-slate-200/80 bg-white transition open:border-blue-300 dark:border-slate-800 dark:bg-slate-900/60 dark:open:border-blue-500/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-800 [&::-webkit-details-marker]:hidden dark:text-slate-100">
                {f.q}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

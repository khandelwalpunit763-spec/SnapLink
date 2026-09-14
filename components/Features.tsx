import { Eraser, Gauge, Music, ShieldCheck, Smartphone, MonitorPlay } from 'lucide-react';

const FEATURES = [
  {
    icon: Gauge,
    title: 'Blazing fast',
    desc: 'Edge-deployed serverless pipeline returns formats in seconds — not minutes.',
  },
  {
    icon: MonitorPlay,
    title: 'Up to 4K quality',
    desc: 'Full ladder available when the source has it: 4K, 1080p HD, 720p and 480p.',
  },
  {
    icon: Music,
    title: 'MP3 audio extractor',
    desc: 'Only need the sound? Grab clean MP3 audio from any supported video.',
  },
  {
    icon: Eraser,
    title: 'No watermark',
    desc: 'Files arrive clean — original quality, no platform watermark or branding.',
  },
  {
    icon: ShieldCheck,
    title: 'Private & safe',
    desc: 'No account, no uploads from your device, no history saved. Paste, download, done.',
  },
  {
    icon: Smartphone,
    title: 'Mobile first',
    desc: 'Fully responsive UI that works beautifully on phones, tablets and desktops.',
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:py-20">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Why SnapLink</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Built for speed. Built for you.
        </h2>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 transition hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-emerald-500/40"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <f.icon className="h-5.5 w-5.5" aria-hidden="true" />
            </span>
            <h3 className="mt-3 font-bold text-slate-900 dark:text-white">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

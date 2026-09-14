import { ClipboardPaste, Download, Gauge } from 'lucide-react';

const STEPS = [
  {
    icon: ClipboardPaste,
    title: 'Paste the link',
    desc: 'Copy the video link from the app or browser (Share → Copy Link) and paste it into SnapLink. We auto-detect the platform.',
  },
  {
    icon: Gauge,
    title: 'Pick your quality',
    desc: 'Choose 4K, Full HD 1080p, 720p, 480p — or grab just the audio as MP3. Pick whatever fits your storage and bandwidth.',
  },
  {
    icon: Download,
    title: 'Hit download',
    desc: 'One tap and the file starts downloading directly. No sign-up, no popups, no forced redirects, no watermark.',
  },
];

export default function Steps() {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:py-20">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">How it works</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Three steps. Done in seconds.
        </h2>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className="relative rounded-2xl border border-slate-200/80 bg-white p-6 transition hover:border-blue-300 hover:shadow-lg hover:shadow-blue-600/5 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-blue-500/40"
          >
            <span className="absolute right-5 top-5 text-4xl font-black text-slate-100 dark:text-slate-800">{i + 1}</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-600/20">
              <s.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

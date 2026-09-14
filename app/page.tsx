import { Film, Gauge, Music, ShieldCheck, Sparkles } from 'lucide-react';
import AdSlot from '@/components/AdSlot';
import Downloader from '@/components/Downloader';
import FAQ from '@/components/FAQ';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PlatformGrid from '@/components/PlatformGrid';
import SEOContent from '@/components/SEOContent';
import Steps from '@/components/Steps';

const TRUST = [
  { icon: Gauge, label: 'Blazing fast' },
  { icon: Film, label: 'Up to 4K' },
  { icon: Music, label: 'MP3 audio' },
  { icon: ShieldCheck, label: '100% private' },
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snaplink.vercel.app';

const FAQ_DATA = [
  {
    q: 'Is SnapLink really free?',
    a: 'Yes — 100% free, no premium tiers, no sign-up and no daily limits.',
  },
  {
    q: 'Which platforms does SnapLink support?',
    a: 'YouTube, Instagram (Reels/Posts/IGTV), Facebook (Videos/Reels/Watch) and X/Twitter (including t.co links).',
  },
  {
    q: 'What is the highest quality I can download?',
    a: 'Up to 4K when the source offers it, plus Full HD 1080p, HD 720p, SD 480p and MP3 audio.',
  },
  {
    q: 'Can I download audio only (MP3)?',
    a: 'Yes — choose the MP3 Audio option in the preview card to save just the soundtrack.',
  },
  {
    q: 'Does SnapLink work on mobile?',
    a: 'Yes, the interface is fully responsive and works in any phone browser.',
  },
  {
    q: 'Is downloading videos legal?',
    a: 'You are responsible for respecting copyright. Only download content you own or that is licensed for offline use.',
  },
];

function jsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'SnapLink',
        description:
          'Download High Quality Videos & Audio in Seconds — from YouTube, Instagram Reels, Facebook and X. Up to 4K & MP3.',
        publisher: { '@id': `${SITE_URL}/#org` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#org`,
        name: 'SnapLink',
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
      },
      {
        '@type': 'WebApplication',
        name: 'SnapLink',
        url: SITE_URL,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any',
        description:
          'Free HD video & MP3 downloader for YouTube, Instagram Reels, Facebook and X (Twitter). 4K, 1080p, 720p, 480p and MP3 — fast, private, no watermark.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        featureList: [
          'YouTube video & Shorts downloader',
          'Instagram Reel downloader (no watermark)',
          'Facebook video downloader',
          'X/Twitter video downloader',
          'YouTube to MP3 audio extraction',
          '4K / 1080p / 720p / 480p quality options',
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_DATA.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
}

export default function Home() {
  const apiConfigured = Boolean(process.env.RAPIDAPI_KEY || process.env.DOWNLOADER_API_URL);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />

      <Header />

      <main id="main">
        {/* Header ad slot */}
        <div className="mx-auto max-w-6xl px-4 pt-6">
          <AdSlot position="header" />
        </div>

        {/* Hero + downloader */}
        <section className="relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-3xl dark:bg-blue-600/20" />
            <div className="absolute -left-32 top-52 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute -right-32 top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-5xl px-4 pb-16 pt-12 text-center sm:pb-20 sm:pt-16">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              100% Free · No Sign-up · No Watermark
            </span>

            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-6xl dark:text-white">
              Download High Quality{' '}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                Videos &amp; Audio
              </span>{' '}
              in Seconds
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
              SnapLink is the free HD video downloader for <strong className="font-semibold text-slate-800 dark:text-slate-200">YouTube</strong>,{' '}
              <strong className="font-semibold text-slate-800 dark:text-slate-200">Instagram Reels</strong>,{' '}
              <strong className="font-semibold text-slate-800 dark:text-slate-200">Facebook</strong> and{' '}
              <strong className="font-semibold text-slate-800 dark:text-slate-200">X (Twitter)</strong> — up to 4K, 1080p, 720p,
              480p and MP3. Fast, private, no watermark, no sign-up.
            </p>

            <Downloader showDemoHint={!apiConfigured} />

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
              {TRUST.map((t) => (
                <span key={t.label} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <t.icon className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <Steps />
        <PlatformGrid />
        <Features />
        <SEOContent />
        <FAQ />

        {/* Bottom CTA */}
        <section className="relative overflow-hidden border-t border-slate-200/60 bg-gradient-to-br from-blue-600 to-emerald-500 dark:border-slate-800/60">
          <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-14 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Ready to save your next video?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-blue-50/90 sm:text-base">
              Paste a link above and get every quality option in a few seconds.
            </p>
            <a
              href="#main"
              className="mt-6 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:bg-blue-50 active:scale-[0.98]"
            >
              Start downloading
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

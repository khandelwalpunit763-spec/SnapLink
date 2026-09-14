import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snaplink.vercel.app';

const TITLE = 'SnapLink — YouTube, Instagram Reels, Facebook & X Video Downloader';
const DESCRIPTION =
  'SnapLink HD Downloader — download videos & MP3 from YouTube, Instagram Reels, Facebook and X (Twitter) in 4K, 1080p HD, 720p and 480p. Fast, free, no watermark, no sign-up. Cricket video downloader & Instagram reel downloader.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | SnapLink',
  },
  description: DESCRIPTION,
  keywords: [
    'Cricket Video Downloader',
    'Instagram Reel Downloader',
    'SnapLink HD Downloader',
    'YouTube video downloader',
    'YouTube to MP3',
    'Facebook video downloader',
    'Twitter video downloader',
    'X video downloader',
    'download reels without watermark',
    '4K video downloader',
    'HD video downloader free',
    'save YouTube Shorts',
    'download cricket highlights',
    'video downloader no sign up',
  ],
  authors: [{ name: 'SnapLink' }],
  creator: 'SnapLink',
  publisher: 'SnapLink',
  category: 'Utilities',
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'SnapLink',
    title: 'SnapLink — Download High Quality Videos & Audio in Seconds',
    description:
      'Free video downloader for YouTube, Instagram Reels, Facebook & X/Twitter. 4K / 1080p / 720p / 480p & MP3. Fast, no watermark, no sign-up.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'SnapLink — Download High Quality Videos & Audio in Seconds',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnapLink — Video & MP3 Downloader',
    description: 'Download videos & MP3 from YouTube, Instagram, Facebook, X in HD/4K. Free, fast, no watermark.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: { canonical: '/' },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
  ],
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('snaplink-theme');var d=t?t==='dark':true;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased dark:bg-slate-950 dark:text-slate-200">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SnapLink — Video & Audio Downloader',
    short_name: 'SnapLink',
    description:
      'Download High Quality Videos & Audio in Seconds — from YouTube, Instagram Reels, Facebook and X. Up to 4K & MP3.',
    id: '/',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#020617',
    theme_color: '#020617',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}

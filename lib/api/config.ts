import type { Platform } from '../types';

export interface RapidApiConfig {
  host: string;
  path: string;
  method: 'GET' | 'POST';
  /** Query param (GET) / body field (POST) that carries the video URL */
  urlParam: string;
}

/**
 * Default RapidAPI endpoints.
 *
 * RapidAPI hosts several different "video downloader" products, each with its
 * own host + path. The defaults below follow the most common conventions;
 * if you subscribe to a different product, override them with env vars
 * (see .env.example / README) — no code changes needed:
 *
 *   RAPIDAPI_YT_HOST  / RAPIDAPI_YT_PATH
 *   RAPIDAPI_IG_HOST  / RAPIDAPI_IG_PATH
 *   RAPIDAPI_FB_HOST  / RAPIDAPI_FB_PATH
 *   RAPIDAPI_TW_HOST  / RAPIDAPI_TW_PATH
 */
const BASE: Record<Platform, RapidApiConfig> = {
  youtube: { host: 'youtube-video-downloader1.p.rapidapi.com', path: '/api/youtube/downloader', method: 'GET', urlParam: 'url' },
  instagram: { host: 'instagram-downloader8.p.rapidapi.com', path: '/api/download/reels', method: 'GET', urlParam: 'url' },
  facebook: { host: 'facebook-video-downloader.p.rapidapi.com', path: '/api/download', method: 'GET', urlParam: 'url' },
  twitter: { host: 'twitter-video-downloader.p.rapidapi.com', path: '/api/download', method: 'GET', urlParam: 'url' },
};

const ENV_PREFIX: Record<Platform, string> = {
  youtube: 'RAPIDAPI_YT',
  instagram: 'RAPIDAPI_IG',
  facebook: 'RAPIDAPI_FB',
  twitter: 'RAPIDAPI_TW',
};

export function getRapidApiConfig(platform: Platform): RapidApiConfig {
  const p = ENV_PREFIX[platform];
  const host = process.env[`${p}_HOST`];
  const path = process.env[`${p}_PATH`];
  return { ...BASE[platform], host: host || BASE[platform].host, path: path || BASE[platform].path };
}

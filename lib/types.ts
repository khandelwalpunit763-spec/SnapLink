export type Platform = 'youtube' | 'instagram' | 'facebook' | 'twitter';
export type Provider = 'self-api' | 'rapidapi' | 'cobalt' | 'demo';

export interface VideoFormat {
  id: string;
  kind: 'video' | 'audio';
  /** Normalized quality bucket: 4k | 1080p | 720p | 480p | 360p | hd | mp3 */
  quality: string;
  /** Human label, e.g. "Full HD 1080p" */
  label: string;
  ext: string;
  size?: number;
  sizeLabel?: string;
  /** Direct download URL (no redirects) */
  url: string;
}

export interface VideoData {
  id: string;
  platform: Platform;
  sourceUrl: string;
  title: string;
  author?: string;
  thumbnail?: string;
  duration?: number;
  durationLabel?: string;
  provider: Provider;
  /** true = metadata only, real download links require a connected API */
  demo: boolean;
  message?: string;
  formats: VideoFormat[];
}

export interface DownloadResponse {
  success: boolean;
  video?: VideoData;
  error?: string;
}

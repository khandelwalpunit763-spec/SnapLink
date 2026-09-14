import { Facebook, Instagram, Twitter, Youtube, type LucideIcon } from 'lucide-react';
import type { Platform } from '@/lib/types';
import { PLATFORM_LABELS } from '@/lib/detectPlatform';

export const PLATFORM_META: Record<Platform, { icon: LucideIcon; color: string; soft: string }> = {
  youtube: { icon: Youtube, color: 'text-red-500', soft: 'bg-red-500/10' },
  instagram: { icon: Instagram, color: 'text-pink-500', soft: 'bg-pink-500/10' },
  facebook: { icon: Facebook, color: 'text-blue-600 dark:text-blue-400', soft: 'bg-blue-600/10' },
  twitter: { icon: Twitter, color: 'text-slate-600 dark:text-slate-300', soft: 'bg-slate-500/10' },
};

export function PlatformIcon({ name, className }: { name: Platform; className?: string }) {
  const { icon: Icon } = PLATFORM_META[name];
  return <Icon className={className} aria-hidden="true" />;
}

export function PlatformChip({ platform }: { platform: Platform }) {
  const { icon: Icon, color, soft } = PLATFORM_META[platform];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${soft} ${color}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {PLATFORM_LABELS[platform]}
    </span>
  );
}

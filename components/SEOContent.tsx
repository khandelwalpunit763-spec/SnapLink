import { Check } from 'lucide-react';

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

/**
 * SEO article section — long-tail keyword coverage
 * (Cricket Video Downloader, Instagram Reel Downloader, SnapLink HD Downloader…)
 * written naturally for users and search engines.
 */
export default function SEOContent() {
  return (
    <section id="guide" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16 sm:py-20">
      <article className="space-y-10">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            How to Download a Video with SnapLink (Step by Step)
          </h2>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            <p>
              SnapLink is a free, fast, HD video downloader that works with YouTube, Instagram Reels, Facebook and X
              (Twitter). There is no software to install and no account to create — everything happens in your browser.
            </p>
            <ul className="space-y-2">
              <CheckItem>
                Open the video or reel you want to save in the YouTube, Instagram, Facebook or X app and tap{' '}
                <strong className="font-semibold text-slate-800 dark:text-slate-200">Share → Copy Link</strong>.
              </CheckItem>
              <CheckItem>
                Come back to SnapLink and tap the <strong className="font-semibold text-slate-800 dark:text-slate-200">Paste</strong>{' '}
                button — or paste manually into the link box.
              </CheckItem>
              <CheckItem>
                Press <strong className="font-semibold text-slate-800 dark:text-slate-200">Download</strong>. SnapLink detects the
                platform, fetches the title, thumbnail and duration, and lists every available quality.
              </CheckItem>
              <CheckItem>
                Pick 4K, 1080p, 720p, 480p or MP3 — the file downloads directly, with no popups or redirects.
              </CheckItem>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Instagram Reel Downloader — Save Reels Without the Watermark
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            Want to save a Reel you love? Copy its link from Instagram and paste it into SnapLink. Unlike screenshot
            tricks or third-party overlays, SnapLink fetches the original video file, so the reel you save has{' '}
            <em>no watermark and no username overlay</em> — the exact footage, in the quality Instagram served it at.
            Posts and IGTV clips work the same way, and the MP3 option lets you keep just the audio, perfect for
            saving a song used in a reel.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Cricket Video Downloader — Save Match Highlights Offline
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            Travelling with a flaky connection or on a strict data plan? A cricket video downloader like SnapLink lets
            you copy the link to a highlight reel, six-max montage or full-innings summary shared on YouTube, Facebook
            or X, and download it in Full HD 1080p for offline replay. Grab a 720p version to save space, or the MP3
            track to listen to the commentary with the phone on silent.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-500">
            Please note: live and replayed matches are usually copyrighted by broadcasters and rights holders. Only
            save content you own or that is licensed for personal offline use.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            YouTube to MP3 — Turn Any Video into Music
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            Podcasts, lo-fi mixes, lectures, songs — if it is on YouTube, SnapLink can extract the audio. Paste the
            link, tap the <strong className="font-semibold text-slate-800 dark:text-slate-200">MP3 Audio</strong> option, and the
            soundtrack downloads as a clean MP3 file. No desktop converter required.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            SnapLink HD Downloader — 4K, 1080p, 720p &amp; 480p
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            SnapLink lists every resolution the source video actually offers, from 4K Ultra HD down to 480p, so you can
            match the file to your screen and your storage. Watch on a 4K TV? Take the 4K file. Archiving to a phone
            with limited space? 720p usually looks nearly identical and costs a fraction of the storage. Each option
            shows the container and approximate size, and downloads start immediately — no premium gate, no countdown,
            no redirect loops.
          </p>
        </div>
      </article>
    </section>
  );
}

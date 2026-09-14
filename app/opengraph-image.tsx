import { ImageResponse } from 'next/og';

export const alt = 'SnapLink — Download High Quality Videos & Audio in Seconds';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 55%, #064e3b 100%)',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px', marginBottom: '44px' }}>
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #2563eb, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: 800,
            }}
          >
            S
          </div>
          <div style={{ fontSize: '60px', fontWeight: 800, letterSpacing: '-2px', display: 'flex', alignItems: 'center' }}>
            Snap<span style={{ color: '#10b981' }}>Link</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', fontSize: '62px', fontWeight: 800, padding: '0 90px', lineHeight: 1.12, letterSpacing: '-1px' }}>
          <div>Download High Quality Videos</div>
          <div>&amp; Audio in Seconds</div>
        </div>
        <div style={{ marginTop: '36px', fontSize: '30px', color: '#94a3b8', textAlign: 'center', padding: '0 80px' }}>
          YouTube • Instagram Reels • Facebook • X — up to 4K &amp; MP3
        </div>
      </div>
    ),
    { ...size }
  );
}

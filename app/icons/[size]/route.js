import { ImageResponse } from 'next/og';

// Generates the home-screen icon. "maskable" has extra safe-zone padding.
export async function GET(_req, { params }) {
  const { size } = await params;
  const maskable = size === 'maskable';
  const px = maskable ? 512 : Math.min(Math.max(parseInt(size) || 512, 48), 1024);
  const fs = px * (maskable ? 0.3 : 0.36);
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg,#1d4ed8,#0b0f1a 80%)', color: '#fff',
        borderRadius: maskable ? 0 : px * 0.22, fontWeight: 900, letterSpacing: -2,
      }}>
        <div style={{ fontSize: fs, lineHeight: 1 }}>SFM</div>
        <div style={{ fontSize: fs * 0.3, letterSpacing: 6, color: '#93c5fd', marginTop: fs * 0.1 }}>AUTO SALES</div>
      </div>
    ),
    { width: px, height: px },
  );
}

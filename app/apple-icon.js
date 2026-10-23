import { ImageResponse } from 'next/og';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg,#1d4ed8,#0b0f1a 80%)', color: '#fff', fontWeight: 900,
      }}>
        <div style={{ fontSize: 64, lineHeight: 1 }}>SFM</div>
        <div style={{ fontSize: 18, letterSpacing: 3, color: '#93c5fd' }}>AUTO SALES</div>
      </div>
    ),
    size,
  );
}

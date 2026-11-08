import { ImageResponse } from 'next/og';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0a', color: '#EDE3DA', fontWeight: 900,
      }}>
        <div style={{ fontSize: 64, lineHeight: 1 }}>SFM</div>
        <div style={{ fontSize: 18, letterSpacing: 3, color: '#E5544C' }}>AUTO SALES</div>
      </div>
    ),
    size,
  );
}

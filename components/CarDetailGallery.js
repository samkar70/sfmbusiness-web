'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Inline Heart icon SVG to avoid external imports
const HeartIcon = ({ filled }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ display: 'block' }}
  >
    <path d="M20.8 4.6c-1.4-1.4-3.6-1.4-5 0L12 8.4l-3.8-3.8c-1.4-1.4-3.6-1.4-5 0-1.5 1.5-1.5 3.9 0 5.4l8.8 8.8 8.8-8.8c1.5-1.5 1.5-3.9 0-5.4z" />
  </svg>
);

// Helper to build image URLs
const imgUrl = (id, idx) => `/api/img/${id}/${idx}`;

export default function CarDetailGallery({
  id,
  count,
  alt,
  noPhoto,
  backHref,
  backLabel,
  shareLabel,
  shareTitle,
}) {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [fav, setFav] = useState(false);

  const photos = Array.from({ length: count });

  const openLightbox = (idx) => {
    setActiveIdx(idx);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const prev = () => setActiveIdx((i) => (i - 1 + count) % count);
  const next = () => setActiveIdx((i) => (i + 1) % count);

  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) next(); else prev();
  };

  const share = async () => {
    const data = { title: shareTitle, url: location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch (e) { }
    } else {
      await navigator.clipboard?.writeText(location.href);
    }
  };

  if (count === 0) return <div className="nophoto">{noPhoto}</div>;

  const extraCount = Math.max(0, count - 4);

  return (
    <div className="gallery-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
      {/* Header */}
      <div
        className="gallery-header"
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <button className="round" onClick={() => router.back()} aria-label={backLabel} style={buttonStyle}>←</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="round" onClick={share} aria-label={shareLabel} style={shareBtnStyle}>⤴</button>
          <button className="round" aria-label="favorite" onClick={() => setFav(!fav)} style={{ ...buttonStyle, color: fav ? '#e63946' : 'inherit' }}><HeartIcon filled={fav} /></button>
        </div>
      </div>

      {/* Mosaic layout */}
      <div className="gallery-grid" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Main photo */}
        <div className="gallery-main" onClick={() => openLightbox(0)} style={{ width: '100%', height: '260px', position: 'relative', cursor: 'pointer' }}>
          <Image src={imgUrl(id, 0)} alt={alt} fill style={{ objectFit: 'cover' }} priority />
        </div>
        {/* Two medium photos */}
        <div className="gallery-side" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', height: '140px' }}>
          {photos.slice(1, 3).map((_, i) => (
            <div key={i} onClick={() => openLightbox(i + 1)} style={{ position: 'relative', cursor: 'pointer' }}>
              <Image src={imgUrl(id, i + 1)} alt={`${alt} ${i + 2}`} fill style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </div>
        {/* Bottom wide photo */}
        <div className="gallery-bottom" onClick={() => openLightbox(3)} style={{ width: '100%', height: '200px', position: 'relative', cursor: 'pointer' }}>
          <Image src={imgUrl(id, 3)} alt={`${alt} 4`} fill style={{ objectFit: 'cover' }} />
          {extraCount > 0 && (
            <div className="overlay-badge" style={overlayBadgeStyle} onClick={() => openLightbox(3)}>
              +{extraCount} fotos
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox} style={lightboxStyle}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()} style={lightboxContentStyle}>
            <button type="button" className="lightbox-close" aria-label="Close" onClick={(e) => { e.stopPropagation(); closeLightbox(); }} style={closeBtnStyle}>✕</button>
            <div
              className="lightbox-image"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              style={{ position: 'absolute', inset: 0, touchAction: 'pan-y' }}
            >
              <Image src={imgUrl(id, activeIdx)} alt={`${alt} ${activeIdx + 1}`} fill style={{ objectFit: 'contain', pointerEvents: 'none' }} />
            </div>
            <div style={counterStyle}>{activeIdx + 1} / {count}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const buttonStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  cursor: 'pointer',
};

const shareBtnStyle = {
  ...buttonStyle,
  background: '#E63946',
  color: '#FFFFFF',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const overlayBadgeStyle = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
};

const lightboxStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const lightboxContentStyle = {
  position: 'relative',
  width: '90%',
  height: '80vh',
  maxWidth: '1200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const closeBtnStyle = {
  position: 'absolute',
  zIndex: 20,
  top: '10px',
  right: '10px',
  background: 'transparent',
  border: 'none',
  color: '#fff',
  fontSize: '24px',
  cursor: 'pointer',
};

const counterStyle = {
  position: 'absolute',
  zIndex: 20,
  pointerEvents: 'none',
  bottom: '10px',
  right: '50%',
  transform: 'translateX(50%)',
  color: '#fff',
  background: 'rgba(0,0,0,0.4)',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '14px',
};

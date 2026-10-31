"use client";
import { useRef, useState } from 'react';
import Link from 'next/link';
import { money } from '@/lib/inventory';
import { milesText } from '@/lib/utils';
import { HeartIcon } from '@/components/Icons';
import { useFavorites } from '@/context/FavoritesContext';

const MAX_DOTS = 5;
const SWIPE_MIN_PX = 40;

export default function CarCard({ car, lang, t, index = 0 }) {
  const count = Number(car.photos) || 0;
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(car.id);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const touchStartX = useRef(null);
  const swiped = useRef(false);

  const goTo = (n) => setCurrentPhoto(Math.max(0, Math.min(count - 1, n)));

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    swiped.current = false;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_MIN_PX) return;
    e.stopPropagation();
    swiped.current = true; // blocks the click that follows a swipe
    goTo(dx < 0 ? currentPhoto + 1 : currentPhoto - 1);
  };
  const onPhotoClick = (e) => {
    if (swiped.current) {
      e.preventDefault();
      e.stopPropagation();
      swiped.current = false;
    }
  };

  // Show at most MAX_DOTS dots, as a window that follows the active photo.
  const dotCount = Math.min(count, MAX_DOTS);
  const dotStart = count > MAX_DOTS ? Math.max(0, Math.min(currentPhoto - Math.floor(MAX_DOTS / 2), count - MAX_DOTS)) : 0;
  const dots = Array.from({ length: dotCount }, (_, k) => dotStart + k);

  return (
    <article className="card" style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}>
      <Link href={`/${lang}/cars/${car.slug}`} aria-label={car.title}>
        <div className="ph" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onClick={onPhotoClick} style={{ touchAction: 'pan-y' }}>
          {count === 0 ? (
            <div className="nophoto">{t.noPhoto}</div>
          ) : (
            <img
              key={currentPhoto}
              src={`/api/img/${car.id}/${currentPhoto}`}
              alt={`${car.title} ${currentPhoto + 1}/${count}`}
              loading={currentPhoto === 0 ? 'eager' : 'lazy'}
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}
          {count > 1 && (
            <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 5 }}>
              {dots.map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n + 1}/${count}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); goTo(n); }}
                  style={{
                    width: n === currentPhoto ? '16px' : '6px',
                    height: '6px',
                    padding: 0,
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    background: n === currentPhoto ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
                    transition: 'width .2s, background .2s',
                  }}
                />
              ))}
            </div>
          )}
          {/* Top-left status badge */}
          <span className={`tag ${car.state === 'available' ? 'ok' : 'soon'}`}>
            {car.state === 'available' ? t.available : t.soon}
          </span>
          {/* Top-right action buttons */}
          <div className="top-actions">
            <button
              type="button"
              className="favorite-btn"
              aria-label={t.favorite}
              aria-pressed={fav}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(car.id); }}
              style={{ color: fav ? '#E63946' : 'rgba(255,255,255,0.75)' }}
            >
              <HeartIcon fill={fav ? '#E63946' : 'none'} />
            </button>
          </div>
        </div>
        <div className="cbody">
          <h2 className="ctitle">{car.title}</h2>
          <p className="csub">{milesText(car, t)}{car.transmission ? ` · ${car.transmission}` : ''}{car.color ? ` · ${car.color}` : ''}</p>
          <p className="csub"><span className="icon-location" aria-hidden="true"></span> Alvarado, TX</p>
          <div className="cfoot">
            <div className="price">{money(car.price) || t.callForPrice}</div>
          </div>
          {/* The whole card is already a <Link>; a span avoids nesting <a> inside <a>. */}
          <span
            className="full-width-btn"
            role="button"
            style={{ display: 'block', textAlign: 'center', background: '#FFCD00', color: '#000000', fontWeight: 700 }}
          >
            {t.viewDetails} →
          </span>
        </div>
      </Link>
    </article>
  );
}

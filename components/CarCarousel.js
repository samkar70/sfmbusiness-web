"use client";
import { useRef, useState } from 'react';

export default function CarCarousel({ id, count, alt }) {
  const strip = useRef(null);
  const [i, setI] = useState(0);

  const go = (n) => {
    strip.current?.scrollTo({ left: n * strip.current.clientWidth, behavior: 'smooth' });
  };

  const onScroll = (e) => {
    setI(Math.round(e.target.scrollLeft / e.target.clientWidth));
  };

  if (count === 0) return <div className="nophoto">No photos</div>;

  return (
    <div className="car-carousel">
      <div className="strip" ref={strip} onScroll={onScroll}>
        {Array.from({ length: count }).map((_, n) => (
          <img
            key={n}
            src={`/api/img/${id}/${n}`}
            alt={`${alt} ${n + 1}/${count}`}
            loading={n === 0 ? 'eager' : 'lazy'}
            style={{ flex: '0 0 100%', width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ))}
      </div>
      <div className="dots">
        {Array.from({ length: count }).map((_, n) => (
          <button
            key={n}
            className={n === i ? 'dot active' : 'dot'}
            onClick={() => go(n)}
            aria-label={`Photo ${n + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

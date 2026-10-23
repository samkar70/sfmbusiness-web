'use client';
import { useRef, useState } from 'react';

export default function Gallery({ id, count, alt, noPhoto, backHref, backLabel, shareLabel, shareTitle }) {
  const strip = useRef(null);
  const [i, setI] = useState(0);
  const go = (n) => strip.current?.scrollTo({ left: n * strip.current.clientWidth, behavior: 'smooth' });
  const onScroll = (e) => setI(Math.round(e.target.scrollLeft / e.target.clientWidth));
  const share = async () => {
    const data = { title: shareTitle, url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch {} }
    else { await navigator.clipboard?.writeText(location.href); }
  };
  return (
    <div className="gal">
      <div className="gbar">
        <a className="round" href={backHref} aria-label={backLabel}>←</a>
        <button className="round" onClick={share} aria-label={shareLabel}>⤴</button>
      </div>
      <div className="strip" ref={strip} onScroll={onScroll}>
        {count === 0 && <div className="nophoto">{noPhoto}</div>}
        {Array.from({ length: count }).map((_, n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={n} src={`/api/img/${id}/${n}`} alt={`${alt} ${n + 1}/${count}`}
               loading={n === 0 ? 'eager' : 'lazy'} fetchPriority={n === 0 ? 'high' : 'auto'} />
        ))}
      </div>
      {count > 1 && <div className="cnt" style={{ position: 'absolute', right: 14, bottom: 62 }}>{i + 1}/{count}</div>}
      {count > 1 && (
        <div className="thumbs">
          {Array.from({ length: count }).map((_, n) => (
            <button key={n} className={n === i ? 'on' : ''} onClick={() => go(n)} aria-label={`${n + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/img/${id}/${n}`} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

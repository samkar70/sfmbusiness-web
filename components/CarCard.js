"use client";
import Link from 'next/link';
import { money, monthly } from '@/lib/cars';
import CarCarousel from '@/components/CarCarousel';
import { HeartIcon, XMarkIcon } from '@/components/Icons';

export function PriceBadge({ rating, t }) {
  if (!rating) return null;
  return <span className={`badge ${rating}`} title={t.priceInfo}><i />{t[rating]}</span>;
}

export const milesText = (c, t) => (c.miles ? `${c.miles.toLocaleString('en-US')} ${t.mi}` : t.milesNA);

export default function CarCard({ car, lang, t, index = 0 }) {
  const pm = monthly(car.price);
  return (
    <article className="card" style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}>
      <Link href={`/${lang}/cars/${car.slug}`} aria-label={car.title}>
        <div className="ph">
          <CarCarousel id={car.id} count={car.photos} alt={car.title} />
          {/* Top-left status badge */}
          <span className={`tag ${car.state === 'available' ? 'ok' : 'soon'}`}>
            {car.state === 'available' ? t.available : t.soon}
          </span>
          {/* Top-right action buttons */}
          <div className="top-actions">
            <button className="favorite-btn" aria-label={t.favorite}>
              <HeartIcon />
            </button>
            <button className="hide-btn" aria-label={t.hide}>
              <XMarkIcon />
            </button>
          </div>
        </div>
        <div className="cbody">
          <h2 className="ctitle">{car.title}</h2>
          <p className="csub">{milesText(car, t)}{car.transmission ? ` · ${car.transmission}` : ''}{car.color ? ` · ${car.color}` : ''}</p>
          <p className="csub"><span className="icon-location" aria-hidden="true"></span> Alvarado, TX</p>
          <div className="cfoot">
            <div>
              <div className="price">{money(car.price) || t.callForPrice}</div>
              {pm && <div className="pm">~${pm} {t.est}</div>}
            </div>
            <PriceBadge rating={car.rating} t={t} />
          </div>
          <button className="full-width-btn" aria-label={t.checkAvailability}>
            {t.checkAvailability}
          </button>
        </div>
      </Link>
    </article>
  );
}

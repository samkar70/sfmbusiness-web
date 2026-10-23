import Link from 'next/link';
import { money, monthly } from '@/lib/cars';

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
          {car.photos > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/api/img/${car.id}/0`} alt={`${car.title} – SFM Auto Sales Alvarado TX`}
                 loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
          ) : <div className="nophoto">{t.noPhoto}</div>}
          <span className={`tag ${car.state === 'available' ? 'ok' : 'soon'}`}>
            {car.state === 'available' ? t.available : t.soon}
          </span>
          {car.photos > 1 && <span className="cnt">📷 {car.photos}</span>}
        </div>
        <div className="cbody">
          <h2 className="ctitle">{car.title}</h2>
          <p className="csub">{milesText(car, t)}{car.transmission ? ` · ${car.transmission}` : ''}{car.color ? ` · ${car.color}` : ''}</p>
          <p className="csub">📍 Alvarado, TX</p>
          <div className="cfoot">
            <div>
              <div className="price">{money(car.price) || t.callForPrice}</div>
              {pm && <div className="pm">~${pm} {t.est}</div>}
            </div>
            <PriceBadge rating={car.rating} t={t} />
          </div>
        </div>
      </Link>
    </article>
  );
}

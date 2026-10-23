import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import CarDetailGallery from '@/components/CarDetailGallery';
import ContactForm from '@/components/ContactForm';
import { PriceBadge } from '@/components/CarCard';
import { milesText } from '@/lib/utils';
import { getCarById, idFromSlug, money, monthly } from '@/lib/cars';
import { getT } from '@/lib/i18n';
import { SITE } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const car = await getCarById(idFromSlug(slug));
  if (!car) return {};
  const t = getT(lang);
  const badgeProps = {priceInfo: t.priceInfo, great: t.great, good: t.good, fair: t.fair, high: t.high};
  const price = money(car.price);
  const desc = lang === 'es'
    ? `${car.title} usado en venta en Alvarado, TX${price ? ` por ${price}` : ''}. ${milesText(car, t)}. Llame o escriba por WhatsApp al ${SITE.phoneDisplay}.`
    : `Used ${car.title} for sale in Alvarado, TX${price ? ` for ${price}` : ''}. ${milesText(car, t)}. Call or WhatsApp ${SITE.phoneDisplay}.`;
  const img = car.photos ? [{ url: `/api/img/${car.id}/0`, alt: car.title }] : undefined;
  return {
    title: `${car.title}${price ? ` – ${price}` : ''}`,
    description: desc,
    alternates: {
      canonical: `/${lang}/cars/${car.slug}`,
      languages: { en: `/en/cars/${car.slug}`, es: `/es/cars/${car.slug}`, 'x-default': `/en/cars/${car.slug}` },
    },
    openGraph: { title: `${car.title}${price ? ` – ${price}` : ''}`, description: desc, type: 'website', images: img },
    twitter: { card: 'summary_large_image', images: img?.map((i) => i.url) },
  };
}

export default async function CarPage({ params }) {
  const { lang, slug } = await params;
  const car = await getCarById(idFromSlug(slug));
  if (!car) notFound();
  const t = getT(lang);
  const badgeProps = {priceInfo: t.priceInfo, great: t.great, good: t.good, fair: t.fair, high: t.high};
  const pm = monthly(car.price);
  const url = `${SITE.url}/${lang}/cars/${car.slug}`;
  const waText = encodeURIComponent(t.waText(car.title));

  const ld = {
    '@context': 'https://schema.org', '@type': 'Car',
    name: car.title, brand: { '@type': 'Brand', name: car.make }, model: car.model,
    vehicleModelDate: String(car.year), productionDate: String(car.year),
    vehicleIdentificationNumber: car.vin || undefined,
    color: car.color || undefined, bodyType: car.body || undefined,
    vehicleTransmission: car.transmission || undefined, fuelType: car.fuel || undefined,
    mileageFromOdometer: car.miles ? { '@type': 'QuantitativeValue', value: car.miles, unitCode: 'SMI' } : undefined,
    itemCondition: 'https://schema.org/UsedCondition',
    image: car.photos ? Array.from({ length: Math.min(car.photos, 5) }, (_, i) => `${SITE.url}/api/img/${car.id}/${i}`) : undefined,
    url,
    offers: car.price ? {
      '@type': 'Offer', price: car.price, priceCurrency: 'USD', url,
      availability: car.state === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      seller: { '@type': 'AutoDealer', name: SITE.name, telephone: SITE.phone },
    } : undefined,
  };
  const crumbs = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.home, item: `${SITE.url}/${lang}` },
      { '@type': 'ListItem', position: 2, name: car.title, item: url },
    ],
  };

  const specs = [
    [t.year, car.year], [t.color, car.color], [t.transmission, car.transmission],
    [t.engine, car.engine], [t.fuel, car.fuel], [t.body, car.body], [t.vin, car.vin],
  ].filter(([, v]) => v);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([ld, crumbs]) }} />
      <Header lang={lang} t={t} path={`/cars/${car.slug}`} />
      <main>
        <CarDetailGallery id={car.id} count={car.photos} alt={car.title} noPhoto={t.noPhoto}
                 backHref={`/${lang}`} backLabel={t.back} shareLabel={t.share} shareTitle={car.title} />
        <div className="sheet">
          <div>
            <h1 className="h2">{car.title}</h1>
            <p className="csub" style={{ marginTop: 4 }}>
              {milesText(car, t)} · 📍 Alvarado, TX · {car.state === 'available' ? t.available : t.soon}
            </p>
          </div>
          <div className="cfoot" style={{ margin: 0 }}>
            <div>
              <div className="price">{money(car.price) || t.callForPrice}</div>
              {pm && <div className="pm">~${pm} {t.est}</div>}
            </div>
            <PriceBadge rating={car.rating} t={badgeProps} />
          </div>
          {pm && <p className="note">{t.estNote} {t.priceInfo}</p>}

          <div className="stats">
            <div className="stat"><b>{car.year}</b><span>{t.year}</span></div>
            <div className="stat"><b>{car.miles ? car.miles.toLocaleString('en-US') : '—'}</b><span>{t.mi}</span></div>
            <div className="stat"><b>{car.transmission || '—'}</b><span>{t.transmission}</span></div>
          </div>

          {specs.length > 0 && (
            <section className="panel">
              <h3>{t.specs}</h3>
              <div>{specs.map(([k, v]) => <div className="spec" key={k}><span>{k}</span><b>{v}</b></div>)}</div>
            </section>
          )}

          <section className="panel">
            <h3>{t.formTitle}</h3>
            <ContactForm t={{ name: t.name, phone: t.phone, yourMessage: t.yourMessage, send: t.send }} whatsapp={SITE.whatsapp} defaultMsg={t.defaultMsg(car.title)} />
          </section>

          <section className="panel">
            <h3>{t.visit}</h3>
            <p className="csub">{SITE.street}, {SITE.city}, {SITE.region} {SITE.zip}<br />{t.hours}</p>
            <a className="btn ghost" href={`https://www.google.com/maps/dir/?api=1&destination=${SITE.lat},${SITE.lng}`} target="_blank" rel="noopener">📍 {t.directions}</a>
          </section>
        </div>
      </main>
      <nav className="cta" aria-label="Contact seller">
        <a className="btn call" href={`tel:${SITE.phone}`}>📞 {t.call}</a>
        <a className="btn wa" href={`https://wa.me/${SITE.whatsapp}?text=${waText}`} target="_blank" rel="noopener">💬 WhatsApp</a>
        <a className="btn primary" href="#contact">✉️ {t.message}</a>
      </nav>
    </>
  );
}

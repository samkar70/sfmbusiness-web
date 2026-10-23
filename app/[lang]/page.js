import Header from '@/components/Header';
import CarCard from '@/components/CarCard';
import { getCars, filterCars } from '@/lib/cars';
import { getT } from '@/lib/i18n';
import { SITE } from '@/lib/site';

export const dynamic = 'force-dynamic'; // data is cached 5 min in lib/cars.js; failures are never cached

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = getT(lang);
  return { title: { absolute: `${SITE.name} | ${t.metaTitle}` }, description: t.metaDesc };
}

const PRICES = [5000, 8000, 10000, 15000, 20000, 30000];
const MILES = [50000, 80000, 100000, 150000];

export default async function Home({ params, searchParams }) {
  const { lang } = await params;
  const sp = await searchParams;
  const t = getT(lang);
  const tCard = {available: t.available, soon: t.soon, favorite: t.favorite, hide: t.hide, checkAvailability: t.checkAvailability, priceInfo: t.priceInfo, great: t.great, good: t.good, fair: t.fair, high: t.high};
  const all = await getCars();
  const cars = filterCars(all, sp);
  const makes = [...new Set(all.map((c) => c.make))].sort();
  const models = [...new Set(all.filter((c) => !sp.make || c.make === sp.make).map((c) => c.model))].sort();
  const years = [...new Set(all.map((c) => c.year).filter(Boolean))].sort((a, b) => b - a);
  const active = ['make', 'model', 'maxPrice', 'minYear', 'maxMiles'].filter((k) => sp[k]).length;

  const list = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    itemListElement: all.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE.url}/${lang}/cars/${c.slug}`, name: c.title })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(list) }} />
      <Header lang={lang} t={t} />
      <main>
        <section className="hero">
          <h1>{t.tagline}</h1>
          <p>{SITE.street}, {SITE.city}, {SITE.region} {SITE.zip}</p>
        </section>

        <form className="search" method="GET" action={`/${lang}`} role="search">
          <label className="sbox">
            <span aria-hidden>🔍</span>
            <input name="q" defaultValue={sp.q || ''} placeholder={t.search} enterKeyHint="search" aria-label={t.search} />
          </label>
          <details className="filters" open={active > 0}>
            <summary>⚙️ {t.filters}{active > 0 ? ` (${active})` : ''}<span>▾</span></summary>
            <div className="fgrid">
              <label>{t.make}
                <select name="make" defaultValue={sp.make || ''}>
                  <option value="">{t.allMakes}</option>
                  {makes.map((m) => <option key={m}>{m}</option>)}
                </select>
              </label>
              <label>{t.model}
                <select name="model" defaultValue={sp.model || ''}>
                  <option value="">{t.allModels}</option>
                  {models.map((m) => <option key={m}>{m}</option>)}
                </select>
              </label>
              <label>{t.maxPrice}
                <select name="maxPrice" defaultValue={sp.maxPrice || ''}>
                  <option value="">{t.any}</option>
                  {PRICES.map((p) => <option key={p} value={p}>${p.toLocaleString('en-US')}</option>)}
                </select>
              </label>
              <label>{t.minYear}
                <select name="minYear" defaultValue={sp.minYear || ''}>
                  <option value="">{t.any}</option>
                  {years.map((y) => <option key={y}>{y}</option>)}
                </select>
              </label>
              <label>{t.maxMiles}
                <select name="maxMiles" defaultValue={sp.maxMiles || ''}>
                  <option value="">{t.any}</option>
                  {MILES.map((m) => <option key={m} value={m}>{m.toLocaleString('en-US')} {t.mi}</option>)}
                </select>
              </label>
              <label>{t.sort}
                <select name="sort" defaultValue={sp.sort || ''}>
                  <option value="">{t.sortNew}</option>
                  <option value="priceAsc">{t.sortPriceAsc}</option>
                  <option value="priceDesc">{t.sortPriceDesc}</option>
                  <option value="miles">{t.sortMiles}</option>
                  <option value="year">{t.sortYear}</option>
                </select>
              </label>
            </div>
            <div className="fact">
              <a className="btn ghost" href={`/${lang}`}>{t.clear}</a>
              <button className="btn primary" type="submit">{t.apply}</button>
            </div>
          </details>
        </form>

        <p className="count" aria-live="polite">{t.results(cars.length)}</p>
        <div className="list">
          {cars.map((c, i) => <CarCard key={c.id} car={c} lang={lang} t={tCard} index={i} />)}
        </div>
        {cars.length === 0 && <p className="empty">{t.noResults}</p>}

        <footer className="foot">
          <b>{t.visit}</b>
          <span>{SITE.street}, {SITE.city}, {SITE.region} {SITE.zip}</span>
          <span>{t.hours}</span>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${SITE.lat},${SITE.lng}`} target="_blank" rel="noopener">📍 {t.directions}</a>
          <span>© {new Date().getFullYear()} {SITE.name} · usedcarventa.com</span>
        </footer>
      </main>
      <nav className="cta" aria-label="Contact">
        <a className="btn call" href={`tel:${SITE.phone}`}>📞 {t.call}</a>
        <a className="btn wa" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener">💬 WhatsApp</a>
      </nav>
    </>
  );
}

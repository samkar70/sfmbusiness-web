import './globals.css';
import { Archivo } from 'next/font/google';
import { notFound } from 'next/navigation';
import { LANGS, SITE } from '@/lib/site';
import { getT } from '@/lib/i18n';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import { FavoritesProvider } from '@/context/FavoritesContext';

export const dynamic = 'force-dynamic';

const font = Archivo({ subsets: ['latin'], display: 'swap' });

export const viewport = {
  width: 'device-width', initialScale: 1, themeColor: '#0a0a0a', viewportFit: 'cover',
};

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = getT(lang);
  return {
    metadataBase: new URL(SITE.url),
    title: { default: `${SITE.name} | ${t.metaTitle}`, template: `%s | ${SITE.name}` },
    description: t.metaDesc,
    applicationName: SITE.name,
    keywords: ['used cars Alvarado TX', 'cars for sale Alvarado Texas', 'used trucks DFW', 'autos usados Dallas Fort Worth', 'SFM Auto Sales'],
    alternates: { canonical: `/${lang}`, languages: { en: '/en', es: '/es', 'x-default': '/en' } },
    openGraph: { type: 'website', siteName: SITE.name, title: `${SITE.name} | ${t.metaTitle}`, description: t.metaDesc, locale: lang === 'es' ? 'es_US' : 'en_US' },
    appleWebApp: { capable: true, title: 'SFM Autos', statusBarStyle: 'black-translucent' },
    formatDetection: { telephone: true },
    robots: { index: true, follow: true },
    verification: { google: '6JzKUzA2wNXJgxmNaK7Ob4hUyYlJLtAxLBpuFClqN94' },
  };
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  if (!LANGS.includes(lang)) notFound();
  const t = getT(lang);
  const dealer = {
    '@context': 'https://schema.org', '@type': 'AutoDealer', name: SITE.name, url: SITE.url,
    telephone: SITE.phone, priceRange: '$$', image: `${SITE.url}/icons/512`,
    address: { '@type': 'PostalAddress', streetAddress: SITE.street, addressLocality: SITE.city, addressRegion: SITE.region, postalCode: SITE.zip, addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.lat, longitude: SITE.lng },
    openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: SITE.hours.opens, closes: SITE.hours.closes },
  };
  return (
    <html lang={lang}>
      <body className={font.className}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dealer) }} />
        <FavoritesProvider><div className="app">{children}</div></FavoritesProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

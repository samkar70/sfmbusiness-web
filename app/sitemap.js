import { getCars } from '@/lib/cars';
import { LANGS, SITE } from '@/lib/site';

export const dynamic = 'force-dynamic';

// Every public page in every language, with hreflang alternates. Sold vehicles drop out automatically.
export default async function sitemap() {
  const cars = await getCars();
  const alternates = (path) => ({
    languages: Object.fromEntries(LANGS.map((l) => [l, `${SITE.url}/${l}${path}`])),
  });

  const home = LANGS.map((lang) => ({
    url: `${SITE.url}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: alternates(''),
  }));

  const vehicles = cars.flatMap((car) =>
    LANGS.map((lang) => ({
      url: `${SITE.url}/${lang}/cars/${car.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: alternates(`/cars/${car.slug}`),
    })),
  );

  return [...home, ...vehicles];
}

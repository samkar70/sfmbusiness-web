import { SITE, LANGS } from '@/lib/site';
import { getCars } from '@/lib/cars';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const cars = await getCars();
  const alt = (path) => ({ languages: Object.fromEntries(LANGS.map((l) => [l, `${SITE.url}/${l}${path}`])) });
  const entries = [];
  for (const l of LANGS) {
    entries.push({ url: `${SITE.url}/${l}`, changeFrequency: 'daily', priority: 1, alternates: alt('') });
    for (const c of cars) {
      entries.push({ url: `${SITE.url}/${l}/cars/${c.slug}`, changeFrequency: 'daily', priority: 0.8, alternates: alt(`/cars/${c.slug}`) });
    }
  }
  return entries;
}

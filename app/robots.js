import { SITE } from '@/lib/site';

export default function robots() {
  return {
    rules: [
      // Vehicle photos are served from /api/img; allow them so Google Images can index them.
      { userAgent: '*', allow: ['/', '/api/img/'], disallow: ['/api/'] },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}

import { getPhoto } from '@/lib/cars';

// Serves vehicle photos stored in Turso as base64, with long CDN caching.
export async function GET(_req, { params }) {
  const { id, n } = await params;
  const photo = await getPhoto(id, Number(n) || 0);
  if (!photo) return new Response('Not found', { status: 404 });
  if (photo.type === 'url') return Response.redirect(photo.url, 302);
  return new Response(photo.buffer, {
    headers: {
      'Content-Type': photo.mime,
      'Cache-Control': 'public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400',
    },
  });
}

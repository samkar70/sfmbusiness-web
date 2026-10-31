import { countPublicVehicles } from '@/lib/cars';

export const dynamic = 'force-dynamic';

// Uptime check. Returns only ok/status to the public. Details are returned only when the request
// carries "Authorization: Bearer <HEALTH_CHECK_TOKEN>", so the database host and credentials
// metadata are never exposed.
export async function GET(req) {
  const expected = process.env.HEALTH_CHECK_TOKEN;
  const authorized = !!expected && req.headers.get('authorization') === `Bearer ${expected}`;
  try {
    const publicVehicles = await countPublicVehicles();
    return Response.json(
      authorized ? { ok: true, publicVehicles } : { ok: true },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (e) {
    console.error('[health] database check failed:', e?.message);
    return Response.json(
      authorized ? { ok: false, error: String(e?.message || e) } : { ok: false },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

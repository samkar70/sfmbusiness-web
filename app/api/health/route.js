import { createClient } from '@libsql/client';

export const dynamic = 'force-dynamic';

// Diagnostics: shows whether env vars are present and whether Turso answers. No secrets returned.
export async function GET() {
  const url = process.env.TURSO_DB_URL || process.env.VITE_TURSO_DB_URL || '';
  const token = process.env.TURSO_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN || '';
  const info = {
    hasUrl: !!url, urlHost: url.replace(/^libsql:\/\//, '').slice(0, 60),
    urlHasWhitespaceOrQuotes: /\s|["']/.test(url),
    hasToken: !!token, tokenLength: token.length,
    tokenHasWhitespaceOrQuotes: /\s|["']/.test(token),
    tokenLooksLikeJwt: token.split('.').length === 3,
  };
  try {
    const c = createClient({ url: url.trim(), authToken: token.trim() });
    const r = await c.execute("SELECT count(*) AS n FROM Vehiculos WHERE LOWER(estado) IN ('available','in shop')");
    return Response.json({ ok: true, publicVehicles: Number(r.rows[0].n), ...info });
  } catch (e) {
    return Response.json({ ok: false, error: String(e?.message || e), ...info }, { status: 500 });
  }
}

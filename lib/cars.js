import { createClient } from '@libsql/client';
import { unstable_cache } from 'next/cache';
import { addPriceRatings, prettyText, slugify } from '@/lib/inventory';

export { filterCars, money, slugify } from '@/lib/inventory';

let _client;
// Server-only. Credentials never reach the browser. Only SELECT queries are used.
const db = () =>
  (_client ??= createClient({
    url: process.env.TURSO_DB_URL || process.env.VITE_TURSO_DB_URL,
    authToken: process.env.TURSO_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN,
  }));

// Only vehicles ready for sale or in the shop are exposed publicly.
const PUBLIC_STATES = ['available', 'in shop'];
const PUBLIC_SQL = PUBLIC_STATES.map((s) => `'${s}'`).join(',');

function normalize(r) {
  const miles = Math.round(Number(r.millas) || Number(r.kilometraje) || 0);
  const make = prettyText(r.marca);
  const model = prettyText(r.modelo);
  const state = String(r.estado || '').toLowerCase() === 'available' ? 'available' : 'soon';
  const car = {
    id: Number(r.id),
    year: Number(r.anio) || null,
    make,
    model,
    price: Number(r.precio_venta) || 0,
    miles,
    state,
    color: prettyText(r.color),
    transmission: prettyText(r.transmision),
    engine: r.motor || '',
    fuel: prettyText(r.combustible),
    body: prettyText(r.tipo_cuerpo),
    vin: r.vin || '',
    photos: Number(r.n_fotos) || 0,
  };
  car.title = [car.year, car.make, car.model].filter(Boolean).join(' ');
  car.slug = `${slugify(car.title)}-${car.id}`;
  return car;
}

const loadCars = unstable_cache(
  async () => {
    const res = await db().execute(`
      SELECT id, marca, modelo, anio, color, precio_venta, estado, millas, kilometraje,
             transmision, motor, combustible, tipo_cuerpo, vin,
             CASE WHEN image_path IS NULL OR length(image_path) < 10 THEN 0
                  WHEN substr(image_path,1,1) = '[' THEN json_array_length(image_path)
                  ELSE 1 END AS n_fotos
      FROM Vehiculos
      WHERE LOWER(estado) IN (${PUBLIC_SQL})
      ORDER BY id DESC`);
    return addPriceRatings(res.rows.map(normalize));
  },
  ['public-cars-v1'],
  { revalidate: 300, tags: ['cars'] },
);

// Last successful load, used only while the database is unreachable.
let lastGoodCars = null;

/**
 * Public inventory. If Turso fails, the last good snapshot is served; with no snapshot the error is
 * thrown so the visitor sees an "unavailable" page instead of a false "no vehicles" result.
 * Errors are not cached by unstable_cache, so the next request retries.
 */
export async function getCars() {
  try {
    const cars = await loadCars();
    lastGoodCars = cars;
    return cars;
  } catch (e) {
    console.error('[getCars] Turso error:', e?.message);
    if (lastGoodCars) return lastGoodCars;
    throw e;
  }
}

/** Live database check for the health endpoint. Not cached. */
export async function countPublicVehicles() {
  const r = await db().execute(`SELECT count(*) AS n FROM Vehiculos WHERE LOWER(estado) IN (${PUBLIC_SQL})`);
  return Number(r.rows[0].n);
}

export async function getCarById(id) {
  const cars = await getCars();
  return cars.find((c) => c.id === Number(id)) || null;
}

export const idFromSlug = (slug) => Number(String(slug).split('-').pop());

// Fetches only the requested photo from the database, and caches it like the inventory.
const loadPhoto = unstable_cache(
  async (id, n) => {
    const res = await db().execute({
      sql: `SELECT CASE WHEN substr(image_path,1,1) = '['
                        THEN json_extract(image_path, ?)
                        ELSE CASE WHEN ? = 0 THEN image_path END
                   END AS src
            FROM Vehiculos WHERE id = ? AND LOWER(estado) IN (${PUBLIC_SQL})`,
      args: [`$[${n}]`, n, id],
    });
    const src = res.rows[0]?.src;
    if (!src) return null;
    const m = /^data:([^;]+);base64,(.+)$/s.exec(src);
    if (m) return { type: 'data', mime: m[1], base64: m[2] };
    if (/^https?:\/\//.test(src)) return { type: 'url', url: src };
    return null;
  },
  ['vehicle-photo-v1'],
  { revalidate: 300, tags: ['cars'] },
);

/** Returns {type:'data', mime, buffer} or {type:'url', url} for photo n of a public vehicle, or null. */
export async function getPhoto(id, n) {
  if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(n) || n < 0) return null;
  const photo = await loadPhoto(id, n);
  if (!photo) return null;
  if (photo.type === 'url') return photo;
  return { type: 'data', mime: photo.mime, buffer: Buffer.from(photo.base64, 'base64') };
}

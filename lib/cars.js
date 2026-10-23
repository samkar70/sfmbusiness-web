import { createClient } from '@libsql/client';
import { unstable_cache } from 'next/cache';

let _client;
// Server-only. Credentials never reach the browser. Only SELECT queries are used.
const db = () =>
  (_client ??= createClient({
    url: process.env.TURSO_DB_URL || process.env.VITE_TURSO_DB_URL,
    authToken: process.env.TURSO_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN,
  }));

const titleCase = (s = '') =>
  String(s).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()).trim();

export const slugify = (s) =>
  String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Only vehicles ready for sale or in the shop are exposed publicly.
const PUBLIC_STATES = ['available', 'in shop'];

function normalize(r) {
  const miles = Math.round(Number(r.millas) || Number(r.kilometraje) || 0);
  const make = titleCase(r.marca);
  const model = String(r.modelo || '').trim();
  const state = String(r.estado || '').toLowerCase() === 'available' ? 'available' : 'soon';
  const car = {
    id: Number(r.id),
    year: Number(r.anio) || null,
    make,
    model,
    price: Number(r.precio_venta) || 0,
    miles,
    state,
    color: titleCase(r.color),
    transmission: titleCase(r.transmision),
    engine: r.motor || '',
    fuel: titleCase(r.combustible),
    body: titleCase(r.tipo_cuerpo),
    vin: r.vin || '',
    photos: Number(r.n_fotos) || 0,
  };
  car.title = [car.year, car.make, car.model].filter(Boolean).join(' ');
  car.slug = `${slugify(car.title)}-${car.id}`;
  return car;
}

/** Price indicator vs. comparable cars (±3 model years) in our own inventory. */
export function addPriceRatings(cars) {
  const priced = cars.filter((c) => c.price > 0);
  return cars.map((c) => {
    if (!c.price) return { ...c, rating: null };
    const comps = priced.filter((o) => o.id !== c.id && Math.abs((o.year || 0) - (c.year || 0)) <= 3);
    if (comps.length < 2) return { ...c, rating: 'fair' };
    const sorted = comps.map((o) => o.price).sort((a, b) => a - b);
    const mid = sorted[Math.floor(sorted.length / 2)];
    const ratio = c.price / mid;
    const rating = ratio <= 0.85 ? 'great' : ratio <= 0.97 ? 'good' : ratio <= 1.08 ? 'fair' : 'high';
    return { ...c, rating };
  });
}

export const getCars = unstable_cache(
  async () => {
    const res = await db().execute(`
      SELECT id, marca, modelo, anio, color, precio_venta, estado, millas, kilometraje,
             transmision, motor, combustible, tipo_cuerpo, vin,
             CASE WHEN image_path IS NULL OR length(image_path) < 10 THEN 0
                  WHEN substr(image_path,1,1) = '[' THEN json_array_length(image_path)
                  ELSE 1 END AS n_fotos
      FROM Vehiculos
      WHERE LOWER(estado) IN (${PUBLIC_STATES.map((s) => `'${s}'`).join(',')})
      ORDER BY id DESC`);
    return addPriceRatings(res.rows.map(normalize));
  },
  ['public-cars-v1'],
  { revalidate: 300, tags: ['cars'] },
);

export async function getCarById(id) {
  const cars = await getCars();
  return cars.find((c) => c.id === Number(id)) || null;
}

export const idFromSlug = (slug) => Number(String(slug).split('-').pop());

/** Returns {type:'data'|'url', ...} for photo n of a vehicle, or null. */
export async function getPhoto(id, n) {
  const res = await db().execute({
    sql: `SELECT image_path FROM Vehiculos WHERE id = ? AND LOWER(estado) IN ('available','in shop')`,
    args: [Number(id)],
  });
  const raw = res.rows[0]?.image_path;
  if (!raw) return null;
  let list;
  try { list = String(raw).startsWith('[') ? JSON.parse(raw) : [raw]; } catch { return null; }
  const src = list.filter(Boolean)[n];
  if (!src) return null;
  const m = /^data:([^;]+);base64,(.+)$/s.exec(src);
  if (m) return { type: 'data', mime: m[1], buffer: Buffer.from(m[2], 'base64') };
  if (/^https?:\/\//.test(src)) return { type: 'url', url: src };
  return null;
}

export function filterCars(cars, p = {}) {
  const q = (p.q || '').toLowerCase().trim();
  let out = cars.filter((c) => {
    if (q && !`${c.title} ${c.color}`.toLowerCase().includes(q)) return false;
    if (p.make && c.make.toLowerCase() !== p.make.toLowerCase()) return false;
    if (p.model && c.model.toLowerCase() !== p.model.toLowerCase()) return false;
    if (p.maxPrice && c.price && c.price > Number(p.maxPrice)) return false;
    if (p.minYear && c.year < Number(p.minYear)) return false;
    if (p.maxMiles && c.miles && c.miles > Number(p.maxMiles)) return false;
    return true;
  });
  const by = {
    priceAsc: (a, b) => (a.price || 1e9) - (b.price || 1e9),
    priceDesc: (a, b) => b.price - a.price,
    miles: (a, b) => (a.miles || 1e9) - (b.miles || 1e9),
    year: (a, b) => b.year - a.year,
  }[p.sort];
  if (by) out = [...out].sort(by);
  return out;
}

export const money = (n) => (n ? `$${Number(n).toLocaleString('en-US')}` : null);

export function monthly(price, rate = 0.079, months = 60) {
  if (!price) return null;
  const r = rate / 12;
  return Math.round((price * r) / (1 - Math.pow(1 + r, -months)));
}

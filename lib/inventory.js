// Pure helpers shared by server and client code.
// Keep database and Next.js server imports out of this file so it can run in the browser and in tests.

// Codes that must stay uppercase even though they have no digits.
const ACRONYMS = new Set(['BMW', 'GMC', 'CR', 'CX', 'ES', 'IS', 'LS', 'LX', 'GX', 'NX', 'RX', 'TLX', 'ILX', 'MDX', 'RDX', 'SE', 'SEL', 'LT', 'LTZ', 'XLE', 'XLT', 'SUV', 'AWD', 'FWD', 'RWD', 'CVT', 'V']);

/** Title-cases catalog text ("ACCORD" -> "Accord") while keeping codes ("BMW", "RAV4", "CR-V") intact. */
export function prettyText(s) {
  if (s == null) return '';
  return String(s)
    .split(/(\s+|-)/)
    .map((tok) => {
      if (!tok || /^(\s+|-)$/.test(tok)) return tok;
      if (/\d/.test(tok) || ACRONYMS.has(tok.toUpperCase())) return tok.toUpperCase();
      return tok[0].toUpperCase() + tok.slice(1).toLowerCase();
    })
    .join('')
    .trim();
}

export const slugify = (s) =>
  String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * Price indicator vs. comparable cars (±3 model years) in our own inventory.
 * Returns rating null when there is not enough data to compare, so no label is shown.
 */
export function addPriceRatings(cars) {
  const priced = cars.filter((c) => c.price > 0);
  return cars.map((c) => {
    if (!c.price) return { ...c, rating: null };
    const comps = priced.filter((o) => o.id !== c.id && Math.abs((o.year || 0) - (c.year || 0)) <= 3);
    if (comps.length < 2) return { ...c, rating: null };
    const sorted = comps.map((o) => o.price).sort((a, b) => a - b);
    const mid = sorted[Math.floor(sorted.length / 2)];
    const ratio = c.price / mid;
    const rating = ratio <= 0.85 ? 'great' : ratio <= 0.97 ? 'good' : ratio <= 1.08 ? 'fair' : 'high';
    return { ...c, rating };
  });
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

import { describe, expect, it } from 'vitest';
import { addPriceRatings, filterCars, money, prettyText, slugify } from '../lib/inventory.js';

describe('prettyText', () => {
  it('title-cases catalog words', () => {
    expect(prettyText('ACCORD')).toBe('Accord');
    expect(prettyText('TOYOTA')).toBe('Toyota');
    expect(prettyText('red')).toBe('Red');
  });

  it('keeps codes and acronyms uppercase', () => {
    expect(prettyText('BMW')).toBe('BMW');
    expect(prettyText('RAV4')).toBe('RAV4');
    expect(prettyText('CR-V')).toBe('CR-V');
    expect(prettyText('IS250')).toBe('IS250');
    expect(prettyText('TLX')).toBe('TLX');
  });

  it('handles hyphenated makes and empty input', () => {
    expect(prettyText('MERCEDES-BENZ')).toBe('Mercedes-Benz');
    expect(prettyText(null)).toBe('');
    expect(prettyText('')).toBe('');
  });
});

describe('slugify', () => {
  it('removes accents and punctuation', () => {
    expect(slugify('2014 Honda Accord Sé')).toBe('2014-honda-accord-se');
  });
});

describe('addPriceRatings', () => {
  const car = (id, year, price) => ({ id, year, price });

  it('returns no rating when there are fewer than two comparables', () => {
    const [a, b] = addPriceRatings([car(1, 2020, 10000), car(2, 2020, 12000)]);
    expect(a.rating).toBeNull();
    expect(b.rating).toBeNull();
  });

  it('rates against the median of comparable cars', () => {
    const cars = [
      car(1, 2020, 8000), // cheap
      car(2, 2020, 10000),
      car(3, 2021, 10000),
      car(4, 2019, 20000), // expensive
    ];
    const rated = Object.fromEntries(addPriceRatings(cars).map((c) => [c.id, c.rating]));
    expect(rated[1]).toBe('great');
    expect(rated[4]).toBe('high');
  });

  it('returns no rating for cars without a price', () => {
    const [c] = addPriceRatings([car(1, 2020, 0)]);
    expect(c.rating).toBeNull();
  });
});

describe('filterCars', () => {
  const cars = [
    { id: 1, title: '2014 Honda Accord', make: 'Honda', model: 'Accord', color: 'Black', year: 2014, price: 13000, miles: 74000 },
    { id: 2, title: '2019 Toyota RAV4', make: 'Toyota', model: 'RAV4', color: 'White', year: 2019, price: 22000, miles: 30000 },
    { id: 3, title: '2017 Honda Civic', make: 'Honda', model: 'Civic', color: 'Red', year: 2017, price: 0, miles: 0 },
  ];

  it('filters by make and max price, keeping cars without price', () => {
    expect(filterCars(cars, { make: 'honda' }).map((c) => c.id)).toEqual([1, 3]);
    expect(filterCars(cars, { maxPrice: '15000' }).map((c) => c.id)).toEqual([1, 3]);
  });

  it('searches title and color', () => {
    expect(filterCars(cars, { q: 'white' }).map((c) => c.id)).toEqual([2]);
  });

  it('sorts by price ascending, with unpriced cars last', () => {
    expect(filterCars(cars, { sort: 'priceAsc' }).map((c) => c.id)).toEqual([1, 2, 3]);
  });
});

describe('money', () => {
  it('formats whole dollars and hides empty values', () => {
    expect(money(13000)).toBe('$13,000');
    expect(money(0)).toBeNull();
  });
});

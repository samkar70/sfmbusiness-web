import { GOOGLE, MARKETPLACE, REVIEWS } from '@/lib/reviews';

// Alternate Google and Marketplace reviews so both show up early when swiping.
const google = REVIEWS.filter((r) => r.source === 'Google');
const other = REVIEWS.filter((r) => r.source !== 'Google');
const MIXED = [];
for (let i = 0; i < Math.max(google.length, other.length); i += 1) {
  if (google[i]) MIXED.push(google[i]);
  if (other[i]) MIXED.push(other[i]);
}

const Stars = () => <span className="stars" role="img" aria-label="5 out of 5 stars">★★★★★</span>;

/** Customer reviews card: a swipeable row of real reviews with a link to the full list. */
export default function Reviews({ t }) {
  if (!REVIEWS.length) return null;
  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <div className="rhead">
        <h2 id="reviews-title">{t.reviewsTitle}</h2>
        <a className="rsum" href={GOOGLE.url} target="_blank" rel="noopener">
          <Stars /> <b>{GOOGLE.rating}</b> · {t.reviewsCount(GOOGLE.count)}
        </a>
        <a className="rsum" href={MARKETPLACE.url} target="_blank" rel="noopener">
          <Stars /> <b>{MARKETPLACE.rating}</b> · {t.marketplaceCount(MARKETPLACE.count)}
        </a>
      </div>
      <div className="rlist" tabIndex={0} aria-label={t.reviewsTitle}>
        {MIXED.map((r) => (
          <figure className="rcard" key={`${r.source}-${r.name}`}>
            <Stars />
            <blockquote>“{r.text}”</blockquote>
            <figcaption><b>{r.name}</b><span>{r.source}</span></figcaption>
          </figure>
        ))}
      </div>
      <a className="rmore" href={GOOGLE.url} target="_blank" rel="noopener">{t.reviewsAll} →</a>
    </section>
  );
}

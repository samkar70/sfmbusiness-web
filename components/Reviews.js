import { GOOGLE, REVIEWS } from '@/lib/reviews';

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
      </div>
      <div className="rlist" tabIndex={0} aria-label={t.reviewsTitle}>
        {REVIEWS.map((r) => (
          <figure className="rcard" key={r.name}>
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

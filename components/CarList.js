'use client';
import Link from 'next/link';
import CarCard from '@/components/CarCard';
import { HeartIcon } from '@/components/Icons';
import { useFavorites } from '@/context/FavoritesContext';

/** "Guardados (X)" pill, toggles the catalog between all cars and saved only. */
export function SavedPill({ label, allIds }) {
  const { savedCarIds, showSaved, setShowSaved } = useFavorites();
  const n = savedCarIds.filter((id) => allIds.includes(id)).length;
  return (
    <button
      type="button"
      className={`saved-pill${showSaved ? ' on' : ''}`}
      aria-pressed={showSaved}
      onClick={() => setShowSaved(!showSaved)}
    >
      <HeartIcon size={16} fill={showSaved || n > 0 ? '#E63946' : 'none'} color={showSaved || n > 0 ? '#E63946' : 'currentColor'} />
      {label} ({n})
    </button>
  );
}

/** Results count + car list + empty states. */
export default function CarList({ cars, lang, t, one, many, noResults, noSaved, noSavedSub, exploreLabel }) {
  const { savedCarIds, showSaved, setShowSaved } = useFavorites();
  const visible = showSaved ? cars.filter((c) => savedCarIds.includes(String(c.id))) : cars;

  return (
    <>
      <p className="count" aria-live="polite">{visible.length} {visible.length === 1 ? one : many}</p>
      <div className="list">
        {visible.map((c, i) => <CarCard key={c.id} car={c} lang={lang} t={t} index={i} />)}
      </div>
      {showSaved && visible.length === 0 && (
        <div className="fav-empty">
          <div className="fav-empty-icon"><HeartIcon size={34} color="#94A3B8" /></div>
          <h2>{noSaved}</h2>
          <p>{noSavedSub}</p>
          <Link href={`/${lang}`} className="fav-empty-btn" onClick={() => setShowSaved(false)}>{exploreLabel}</Link>
        </div>
      )}
      {!showSaved && cars.length === 0 && <p className="empty">{noResults}</p>}
    </>
  );
}

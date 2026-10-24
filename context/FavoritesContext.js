'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'savedCarIds';
const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [savedCarIds, setSavedCarIds] = useState([]);
  const [showSaved, setShowSaved] = useState(false); // catalog view: all vs. saved only
  const [ready, setReady] = useState(false);

  // Load after mount to avoid SSR hydration mismatches.
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(raw)) setSavedCarIds(raw.map(String));
    } catch (e) { /* ignore corrupt data */ }
    setReady(true);
  }, []);

  // Keep tabs in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      try { setSavedCarIds(JSON.parse(e.newValue || '[]').map(String)); } catch (err) { }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleFavorite = useCallback((id) => {
    const key = String(id);
    setSavedCarIds((prev) => {
      const next = prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) { }
      return next;
    });
  }, []);

  const isFavorite = useCallback((id) => savedCarIds.includes(String(id)), [savedCarIds]);

  const value = useMemo(
    () => ({ savedCarIds, toggleFavorite, isFavorite, showSaved, setShowSaved, ready }),
    [savedCarIds, toggleFavorite, isFavorite, showSaved, ready]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}

'use client';
import { useEffect } from 'react';

// Registers the service worker (offline fallback page). It shows no install prompt or other UI.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);
  return null;
}

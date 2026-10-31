import Header from '@/components/Header';
import { SITE } from '@/lib/site';

// Shown when the inventory cannot be loaded and no cached copy exists.
// Visitors see a clear message instead of a false "no vehicles" result.
export default function Unavailable({ lang, t }) {
  return (
    <>
      <Header lang={lang} t={t} />
      <main style={{ padding: '64px 24px', textAlign: 'center', display: 'grid', gap: 14, justifyItems: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>{t.unavailableTitle}</h1>
        <p style={{ color: 'var(--mut)', maxWidth: 320 }}>{t.unavailableSub}</p>
        <a className="btn primary" href={`/${lang}`} style={{ flex: 'none', padding: '0 28px' }}>{t.retry}</a>
        <a className="btn ghost" href={`tel:${SITE.phone}`} style={{ padding: '0 28px' }}>📞 {SITE.phoneDisplay}</a>
      </main>
    </>
  );
}

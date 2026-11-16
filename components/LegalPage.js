import Link from 'next/link';
import Header from '@/components/Header';
import LegalLinks from '@/components/LegalLinks';
import { LEGAL, LEGAL_UPDATED } from '@/lib/legal';
import { getT } from '@/lib/i18n';

/** Shared layout for the Privacy Policy and Terms of Use pages. */
export default function LegalPage({ lang, doc }) {
  const t = getT(lang);
  const page = LEGAL[lang]?.[doc] || LEGAL.en[doc];
  const updated = new Date(`${LEGAL_UPDATED}T12:00:00`).toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <>
      <Header lang={lang} t={t} path={`/${doc}`} />
      <main id="main" className="legal">
        <Link className="legal-back" href={`/${lang}`}>← {t.legalBack}</Link>
        <h1>{page.title}</h1>
        <p className="legal-date">{lang === 'es' ? 'Actualizado' : 'Updated'}: {updated}</p>
        {page.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((para) => <p key={para}>{para}</p>)}
          </section>
        ))}
        <LegalLinks lang={lang} t={t} />
      </main>
    </>
  );
}

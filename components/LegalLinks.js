import Link from 'next/link';

/** Footer links to the Privacy Policy and Terms of Use. */
export default function LegalLinks({ lang, t }) {
  return (
    <nav className="legal-links" aria-label="Legal">
      <Link href={`/${lang}/privacy`}>{t.legalPrivacy}</Link>
      <span aria-hidden="true">·</span>
      <Link href={`/${lang}/terms`}>{t.legalTerms}</Link>
    </nav>
  );
}

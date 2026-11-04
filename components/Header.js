import Link from 'next/link';

export default function Header({ lang, t, path = '' }) {
  return (
    <header className="top">
      <Link href={`/${lang}`} className="logo" aria-label="SFM Auto Sales">
        <span className="sfm" style={{ color: '#FFFFFF' }}>SFM</span> <b style={{ color: '#E63946' }}>Auto Sales</b>
        <small>Alvarado · TX</small>
      </Link>
      <nav className="lang" aria-label="Language">
        <Link href={`/en${path}`} hrefLang="en" className={lang === 'en' ? 'on' : ''}>EN</Link>
        <Link href={`/es${path}`} hrefLang="es" className={lang === 'es' ? 'on' : ''}>ES</Link>
      </nav>
    </header>
  );
}

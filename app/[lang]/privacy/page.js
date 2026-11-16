import LegalPage from '@/components/LegalPage';
import { LEGAL } from '@/lib/legal';
import { SITE } from '@/lib/site';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const page = LEGAL[lang]?.privacy || LEGAL.en.privacy;
  return {
    title: page.title,
    alternates: { canonical: `/${lang}/privacy`, languages: { en: '/en/privacy', es: '/es/privacy', 'x-default': '/en/privacy' } },
    description: `${page.title} · ${SITE.name}`,
  };
}

export default async function Page({ params }) {
  const { lang } = await params;
  return <LegalPage lang={lang} doc="privacy" />;
}

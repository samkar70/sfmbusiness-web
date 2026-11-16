import LegalPage from '@/components/LegalPage';
import { LEGAL } from '@/lib/legal';
import { SITE } from '@/lib/site';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const page = LEGAL[lang]?.terms || LEGAL.en.terms;
  return {
    title: page.title,
    alternates: { canonical: `/${lang}/terms`, languages: { en: '/en/terms', es: '/es/terms', 'x-default': '/en/terms' } },
    description: `${page.title} · ${SITE.name}`,
  };
}

export default async function Page({ params }) {
  const { lang } = await params;
  return <LegalPage lang={lang} doc="terms" />;
}

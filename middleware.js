import { NextResponse } from 'next/server';
import { pickLang } from './lib/i18n';

// Redirect "/" and any non-localized path to the language of the user's phone.
export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (/^\/(en|es)(\/|$)/.test(pathname)) return NextResponse.next();
  const lang = pickLang(req.headers.get('accept-language') || '');
  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`;
  const res = NextResponse.redirect(url, 307);
  res.headers.set('Vary', 'Accept-Language');
  return res;
}

export const config = {
  matcher: ['/((?!api|icons|_next|.*\\..*).*)'],
};

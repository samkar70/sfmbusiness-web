import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.usedcarventa.com'),
  title: 'SFM Auto Sales | Autos y camionetas usados en Alvarado, TX',
  description: 'Inventario de autos y camionetas usados en Alvarado, TX. Calidad, financiamiento y el mejor precio garantizado.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SFM Auto Sales | Autos y camionetas usados en Alvarado, TX',
    description: 'Encuentra tu próximo auto o camioneta en Alvarado, TX.',
    url: 'https://www.usedcarventa.com',
    siteName: 'SFM Auto Sales',
    locale: 'es_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

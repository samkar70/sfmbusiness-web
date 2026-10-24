import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.sfmautosales.com'),
  title: {
    default: 'SFM Auto Sales | Used Cars & Trucks in Alvarado, TX',
    template: '%s | SFM Auto Sales',
  },
  description: 'Used cars and trucks in Alvarado, TX. Autos y camionetas usados con financiamiento y el mejor precio en Alvarado, TX.',
  alternates: {
    canonical: '/',
  },
  verification: {
    google: '6JzKUzA2wNXJgxmNaK7Ob4hUyYlJLtAxLBpuFClqN94',
  },
  openGraph: {
    title: 'SFM Auto Sales | Used Cars & Trucks in Alvarado, TX',
    description: 'Find your next vehicle in Alvarado, TX. Encuentra tu próximo auto o camioneta.',
    url: 'https://www.sfmautosales.com',
    siteName: 'SFM Auto Sales',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default function manifest() {
  return {
    name: 'SFM Auto Sales – Used Cars Alvarado TX',
    short_name: 'SFM Autos',
    description: 'Used cars & trucks in Alvarado, TX',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0b0f1a',
    theme_color: '#0b0f1a',
    categories: ['shopping', 'automotive'],
    icons: [
      { src: '/icons/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}

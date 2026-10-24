import { getCars } from '@/lib/db';

export default async function sitemap() {
  const baseUrl = 'https://www.usedcarventa.com';
  let cars = [];
  try {
    cars = await getCars();
  } catch (e) {
    cars = [];
  }

  const staticRoutes = ['', '/es', '/en'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  }));

  const carRoutes = cars.flatMap((car) => [
    {
      url: `${baseUrl}/es/cars/${car.slug || car.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/cars/${car.slug || car.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]);

  return [...staticRoutes, ...carRoutes];
}

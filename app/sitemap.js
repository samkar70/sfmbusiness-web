export default async function sitemap() {
  const baseUrl = 'https://www.sfmautosales.com';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];
}

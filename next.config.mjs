/** @type {import('next').NextConfig} */
export default {
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }] },
    ];
  },
};

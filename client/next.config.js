// next.config.js
const nextConfig = {
  output: 'export',
  experimental: {
    cacheHandler: './cache-handler.js',
  },
};

export default nextConfig;

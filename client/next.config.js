module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com', 'localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  },
  trailingSlash: true,
}

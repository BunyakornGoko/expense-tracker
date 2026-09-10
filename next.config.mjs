/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['tesseract.js', 'tesseract.js-core'],
  // tesseract.js loads its worker-script via worker_threads at runtime (not require()/import),
  // so Next's static file tracer can't follow requires inside it and misses sibling files
  // (worker-script/index.js, getCore.js, gunzip.js, cache.js, ...). Force the whole package in.
  outputFileTracingIncludes: {
    '/share-slip': ['./node_modules/tesseract.js/**', './node_modules/tesseract.js-core/**'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

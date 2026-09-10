/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // tesseract.js loads its worker-script via worker_threads at runtime (not require()/import),
  // so Next's static file tracer can't see into it and repeatedly misses its transitive deps
  // (bmp-js, zlibjs, ...). Keep it un-bundled — the Dockerfile ships the full node_modules
  // instead of relying on the pruned/traced standalone one for this package.
  serverExternalPackages: ['tesseract.js', 'tesseract.js-core'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

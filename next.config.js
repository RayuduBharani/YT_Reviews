/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Clean cache and optimize images
    images: {
        unoptimized: true,
    },
    // Reduce bundle size
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['@radix-ui', '@heroicons', 'lucide-react'],
    },
}

module.exports = nextConfig

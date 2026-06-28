/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Genkit + google-auth-library are Node-only CJS packages that fail to
  // instantiate when bundled by Turbopack (dev). Loading them as native Node
  // requires on the server fixes the dev crash and is recommended for prod too.
  serverExternalPackages: [
    'genkit',
    '@genkit-ai/google-genai',
    '@genkit-ai/next',
    'google-auth-library',
    'gtoken',
    'jws',
    'jwa',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;

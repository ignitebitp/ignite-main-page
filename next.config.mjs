/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    agentUpgrade: 'security',
  },
  serverExternalPackages: [
    'mongoose',
    'mongodb',
    'bcryptjs',
    'sharp',
    'pdf-lib',
    'qrcode',
    'groq-sdk',
    'nodemailer',
  ],
  async rewrites() {
    return [
      {
        source: '/share/:path*',
        destination: '/api/share/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;

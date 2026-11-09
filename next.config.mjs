/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
    ];
  },
};

export default nextConfig;

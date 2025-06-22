/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true
  },
  env: {
    WORKER_URL: process.env.WORKER_URL,
    INSTAGRAM_STORY_API_URL: process.env.INSTAGRAM_STORY_API_URL,
    FACEBOOK_MEDIA_API_URL: process.env.FACEBOOK_MEDIA_API_URL,
    DOUYIN_MEDIA_API_URL: process.env.DOUYIN_MEDIA_API_URL,
    TIKTOK_MEDIA_API_URL: process.env.TIKTOK_MEDIA_API_URL,
    YOUTUBE_MEDIA_API_URL: process.env.YOUTUBE_MEDIA_API_URL,
    RAPID_API_KEY_FOR_DOUYIN: process.env.RAPID_API_KEY_FOR_DOUYIN,
    RAPID_API_KEY_FOR_TIKTOK: process.env.RAPID_API_KEY_FOR_TIKTOK,
    RAPID_API_KEY_FOR_YOUTUBE: process.env.RAPID_API_KEY_FOR_YOUTUBE
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer,
      resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
      use: ['@svgr/webpack']
    });

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  }
};

export default nextConfig;

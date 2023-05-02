/* 公開時のサブディレクトリ */
const SUB_DIRECTORY = '/turnip';

/* 本番環境と開発環境の分岐用のフラグ */
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: isProd ? SUB_DIRECTORY : '',
  assetPrefix: isProd ? SUB_DIRECTORY : '',
  publicRuntimeConfig: {
    basePath: isProd ? SUB_DIRECTORY : '',
  },
  trailingSlash: true,
}

module.exports = nextConfig

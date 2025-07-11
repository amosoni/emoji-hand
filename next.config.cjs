/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
require("./src/env.js");
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 你可以在这里添加其他 next 配置项
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    config.resolve.alias['~'] = path.resolve(__dirname, 'src');
    return config;
  },
};
module.exports = nextConfig;

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  // webpack: (config) => {
  //   // this will override the experiments
  //   config.experiments = { ...config.experiments, topLevelAwait: true };
  //   // this will just update topLevelAwait property of config.experiments
  //   // config.experiments.topLevelAwait = true
  //   return config;
  // },
};

module.exports = withBundleAnalyzer(nextConfig);

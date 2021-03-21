const withImages = require("next-images");
const withOffline = require("next-offline");

module.exports = withOffline(
  withImages({
    webpack: (config) => {
      // Fix issue related to: https://github.com/tj/consolidate.js/issues/295
      config.externals.push({ consolidate: "commonjs consolidate" });
      return config;
    },
    target: "serverless",
    transformManifest: (manifest) => ["/"].concat(manifest), // add the homepage to the cache
    generateInDevMode: true,
    workboxOpts: {
      swDest: "static/service-worker.js",
      runtimeCaching: [
        {
          urlPattern: /^https?.*/,
          handler: "NetworkFirst",
          options: {
            cacheName: "https-calls",
            networkTimeoutSeconds: 15,
            expiration: {
              maxEntries: 150,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    env: {
      ROOT: __dirname,
    },
  })
);

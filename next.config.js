const withOffline = require("next-offline");
const withImages = require("next-images");

module.exports = withOffline(
  withImages({
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
  })
);

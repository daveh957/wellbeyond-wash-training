/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

if ("function" === typeof importScripts) {
  const env = new URL(location).searchParams.get('env');
  const fbConf = encodeURIComponent(new URL(location).searchParams.get('fbConf'));
  importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js");
  importScripts(`firebase-messaging-sw.js?env=${env}&fbConf=${fbConf}`);

  // Global workbox
  if (workbox) {
    console.log("Workbox is loaded");

    // Disable logging
    workbox.setConfig({ debug: true });

    //`generateSW` and `generateSWString` provide the option
    // to force update an exiting service worker.
    // Since we're using `injectManifest` to build SW,
    // manually overriding the skipWaiting();
    self.addEventListener("install", (event) => {
      self.skipWaiting();
      // window.location.reload();
    });

    // Manual injection point for manifest files.
    // All assets under build/ and 5MB sizes are precached.
    workbox.precaching.precacheAndRoute([]);

    // Font caching
    workbox.routing.registerRoute(
      new RegExp("https://fonts.(?:.googlepis|gstatic).com/(.*)"),
      workbox.strategies.cacheFirst({
        cacheName: "googleapis",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 30,
          }),
        ],
      })
    );

    // Image caching
    workbox.routing.registerRoute(
      /https:\/\/res\.cloudinary\.com\/.*\.(?:png|jpg|jpeg|svg|gif)/,
      workbox.strategies.cacheFirst({
        cacheName: 'image-cache',
        plugins: [
          new workbox.cacheableResponse.Plugin({
            statuses: [200]
          }),
        ]
      })
    );

    // Video caching
    workbox.routing.registerRoute(
      /https:\/\/res\.cloudinary\.com\/.*\.(?:mp4)/,
      workbox.strategies.cacheFirst({
        cacheName: "video-cache",
        plugins: [
          new workbox.rangeRequests.Plugin(),
          new workbox.cacheableResponse.Plugin({
            statuses: [200]
          }),
        ],
      })
    );

    // JS, CSS caching
    workbox.routing.registerRoute(
      /\.(?:js|css)$/,
      workbox.strategies.staleWhileRevalidate({
        cacheName: "static-resources",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 20 * 24 * 60 * 60, // 20 Days
          }),
        ],
      })
    );
  } else {
    console.error("Workbox could not be loaded. No offline support");
  }

}

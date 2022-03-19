// Service workers bark at bundled code. So this
// little try catch and importScripts helps and is
// from the manifest v2 -> v3 migration guids
// The background.js is the real service worker
try {
  importScripts('./background.bundle.js');
} catch (e) {
  console.error(e);
}

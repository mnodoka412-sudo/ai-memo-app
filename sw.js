const CACHE_NAME = 'ai-memo-app-v1';
const urlsToCache = [
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// インストール時の処理（ファイルをキャッシュに保存する）
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// リクエスト時の処理（オフラインのときはキャッシュから返す）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
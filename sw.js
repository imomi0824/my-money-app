// 🔥 關鍵修改：這裡的版本號變了，手機才會知道要重抓 index.html
const CACHE_NAME = 'money-app-v14.10'; 

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', event => {
  // 強制 skipWaiting，讓新版 SW 立刻接手 (加速更新生效)
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  // 啟動時，檢查並刪除所有「舊版本」的快取
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 如果快取名稱跟現在的不一樣 (例如 v14.9)，就刪掉它
          if (cacheName !== CACHE_NAME) {
            console.log('刪除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 讓新的 SW 立即控制所有頁面
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
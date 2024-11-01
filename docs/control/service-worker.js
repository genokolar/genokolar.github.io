const CACHE_NAME = `KeyCtrl-Glab-v1`;
const CURRENT_CACHE_VERSION = 2; // 当前缓存版本

// 使用 install 事件预缓存所有初始资源
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      './index.html',
      './css/control.css',
      './js/control.js',
      './app.png',
      './css/all.min.css',
      './fonts/fa-solid-900.woff2'
    ]);
  })());
});

// 使用 activate 事件处理缓存更新
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // 获取所有缓存名称
    const cacheNames = await caches.keys();

    // 遍历所有缓存名称，删除旧版本的缓存
    cacheNames.forEach(cacheName => {
      if (cacheName !== CACHE_NAME) {
        caches.delete(cacheName);
      }
    });
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // 从缓存中获取资源
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
      try {
        // 如果资源不在缓存中，尝试从网络获取
        const fetchResponse = await fetch(event.request);

        // 将新获取的资源添加到缓存中
        cache.put(event.request, fetchResponse.clone());
        return fetchResponse;
      } catch (e) {
        // 网络请求失败
      }
    }
  })());
});
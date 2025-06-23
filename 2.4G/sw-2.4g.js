const CURRENT_CACHE_VERSION = 10; // 当前缓存版本
const CACHE_NAME = `2.4G-Receiver-v${CURRENT_CACHE_VERSION}`;

const broadcast = new BroadcastChannel('sw-update-channel');
// 定义消息类型常量
const CRITICAL_SW_UPDATE_MESSAGE = 'CRITICAL_SW_UPDATE';

// 使用 install 事件预缓存所有初始资源
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll([
        '/offline.html',
        '/css/24g.css',
        '/js/script.js',
        '/app.png',
      ]);
      broadcast.postMessage({ type: CRITICAL_SW_UPDATE_MESSAGE });
    } catch (error) {
      console.error('Caching failed:', error);
    }
  })());
});

// 使用 activate 事件处理缓存更新
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // 获取所有缓存名称
    const cacheNames = await caches.keys();

    for (const cacheName of cacheNames) {
      if (cacheName !== CACHE_NAME && cacheName.startsWith('2.4G-Receiver-v')) {
        await caches.delete(cacheName); // 等待删除完成
      }
    }
  })());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      if (event.request.method !== 'GET') return;

      let response;

      response = await cache.match(event.request);
      if (response) return response;

      try {
        const fetchResponse = await fetch(event.request);
        if (fetchResponse.ok) {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        }
      } catch (error) {
        response = await cache.match('/offline.html');
      }

      return response || new Response('Offline page not found', { status: 404 });
    })()
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
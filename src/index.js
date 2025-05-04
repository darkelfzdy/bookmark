import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import Bookmarks from './bookmark';

// 环境变量绑定
const BOOKMARKS_NAMESPACE = 'BOOKMARKS';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 处理静态资源请求
    if (path.startsWith('/static/') || path === '/' || path.startsWith('/_next/')) {
      try {
        return await getAssetFromKV({
          request,
          waitUntil(promise) {
            return ctx.waitUntil(promise);
          },
        }, {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
        });
      } catch (e) {
        return new Response('Asset not found', { status: 404 });
      }
    }

    // API 端点处理
    if (path.startsWith('/api/bookmarks')) {
      const bookmarksId = env[BOOKMARKS_NAMESPACE].idFromName('bookmarks');
      const bookmarksStub = env[BOOKMARKS_NAMESPACE].get(bookmarksId);

      if (path === '/api/bookmarks') {
        if (request.method === 'GET') {
          return bookmarksStub.getBookmarks();
        } else if (request.method === 'POST') {
          const body = await request.json();
          return bookmarksStub.addBookmark(body);
        } else {
          return new Response('Method not allowed', { status: 405 });
        }
      } else if (path.startsWith('/api/bookmarks/')) {
        if (request.method === 'DELETE') {
          const id = path.split('/').pop();
          return bookmarksStub.deleteBookmark(id);
        } else {
          return new Response('Method not allowed', { status: 405 });
        }
      }
    }

    return new Response('Not found', { status: 404 });
  },
};

// Durable Object 类导出
export { Bookmarks as BookmarkStore };
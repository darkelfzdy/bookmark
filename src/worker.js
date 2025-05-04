export class Bookmarks {
  constructor(state, env) {
    this.state = state;
    this.bookmarks = [];
    this.initialize();
  }

  async initialize() {
    await this.state.blockConcurrencyWhile(async () => {
      const storedBookmarks = await this.state.storage.get('bookmarks');
      if (storedBookmarks) {
        this.bookmarks = storedBookmarks;
      } else {
        this.bookmarks = [
          { id: crypto.randomUUID(), title: '百度', url: 'https://www.baidu.com' },
          { id: crypto.randomUUID(), title: '起点', url: 'https://www.qidian.com' }
        ];
        await this.state.storage.put('bookmarks', this.bookmarks);
      }
    });
  }

  async getBookmarks() {
    return this.bookmarks;
  }

  async addBookmark(bookmark) {
    await this.state.blockConcurrencyWhile(async () => {
      const newBookmark = {
        id: crypto.randomUUID(),
        title: bookmark.title,
        url: bookmark.url
      };
      this.bookmarks.push(newBookmark);
      await this.state.storage.put('bookmarks', this.bookmarks);
      return newBookmark;
    });
  }

  async deleteBookmark(id) {
    await this.state.blockConcurrencyWhile(async () => {
      this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
      await this.state.storage.put('bookmarks', this.bookmarks);
    });
  }
}

// 导出Durable Object以供Cloudflare Pages Functions调用
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const id = env.BOOKMARKS.idFromName('bookmarks');
    const stub = env.BOOKMARKS.get(id);

    if (url.pathname === '/bookmarks' && request.method === 'GET') {
      const bookmarks = await stub.getBookmarks();
      return new Response(JSON.stringify(bookmarks), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (url.pathname === '/bookmarks' && request.method === 'POST') {
      const bookmark = await request.json();
      const newBookmark = await stub.addBookmark(bookmark);
      return new Response(JSON.stringify(newBookmark), {
        headers: { 'Content-Type': 'application/json' },
        status: 201
      });
    } else if (url.pathname.startsWith('/bookmarks/') && request.method === 'DELETE') {
      const id = url.pathname.split('/').pop();
      await stub.deleteBookmark(id);
      return new Response(null, { status: 204 });
    }

    return new Response('Not found', { status: 404 });
  }
};
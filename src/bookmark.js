export default class Bookmarks {
  constructor(state, env) {
    this.state = state;
    this.storage = state.storage;
  }

  async getBookmarks() {
    const bookmarks = await this.storage.get('bookmarks') || [];
    return new Response(JSON.stringify(bookmarks), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async addBookmark(bookmark) {
    if (!bookmark.url || !bookmark.title) {
      return new Response('Missing required fields', { status: 400 });
    }

    const bookmarks = await this.storage.get('bookmarks') || [];
    const id = Date.now().toString();
    const newBookmark = { id, title: bookmark.title, url: bookmark.url };
    bookmarks.push(newBookmark);
    await this.storage.put('bookmarks', bookmarks);

    return new Response(JSON.stringify(newBookmark), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async deleteBookmark(id) {
    const bookmarks = await this.storage.get('bookmarks') || [];
    const index = bookmarks.findIndex(b => b.id === id);
    if (index === -1) {
      return new Response('Bookmark not found', { status: 404 });
    }

    bookmarks.splice(index, 1);
    await this.storage.put('bookmarks', bookmarks);
    return new Response('', { status: 204 });
  }
}
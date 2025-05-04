// 配置为使用边缘运行时
export const runtime = 'edge';
import { jsonResponse } from '../../lib/utils';

export default async function handler(req, context) {
  const { method } = req;

  try {
    const bookmarksDO = context.env.BOOKMARKS;
    const id = bookmarksDO.idFromName("shared-bookmark-list");
    const stub = await bookmarksDO.get(id);

    if (method === 'GET') {
      const bookmarks = await stub.getBookmarks();
      return jsonResponse(200, bookmarks);
    } else if (method === 'POST') {
      const body = await req.json();
      const { url, title } = body;
      if (!url || !title) {
        return jsonResponse(400, { error: 'URL and title are required' });
      }
      const newBookmark = await stub.addBookmark({ url, title });
      return jsonResponse(201, newBookmark);
    } else {
      return jsonResponse(405, { error: 'Method not allowed' });
    }
  } catch (error) {
    return jsonResponse(500, { error: error.message });
  }
}
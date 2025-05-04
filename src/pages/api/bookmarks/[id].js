// 配置为使用边缘运行时
export const runtime = 'edge';
import { jsonResponse } from '../../../lib/utils';

export default async function handler(req, context) {
  const { method, query } = req;
  const { id } = query;

  if (method !== 'DELETE') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  try {
    const bookmarksDO = context.env.BOOKMARKS;
    const doId = bookmarksDO.idFromName("shared-bookmark-list");
    const stub = await bookmarksDO.get(doId);

    const result = await stub.deleteBookmark(id);
    if (result) {
      return jsonResponse(200, { message: 'Bookmark deleted successfully' });
    } else {
      return jsonResponse(404, { error: 'Bookmark not found' });
    }
  } catch (error) {
    return jsonResponse(500, { error: error.message });
  }
}
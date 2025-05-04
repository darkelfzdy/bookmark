import { supabase } from '@/lib/db'

export async function initBookmarks() {
  const { data } = await supabase.from('bookmarks').select('*')
  if (data?.length === 0) {
    await supabase.from('bookmarks').insert([
      { url: 'https://www.baidu.com', title: '百度' },
      { url: 'https://www.qidian.com', title: '起点中文网' }
    ])
  }
}
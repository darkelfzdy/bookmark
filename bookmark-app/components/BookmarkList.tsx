'use client'

import { useEffect, useState } from 'react'

type Bookmark = {
  id: number
  url: string
  title: string
  created_at: string
}

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bookmarks')
      .then(res => res.json())
      .then(data => {
        setBookmarks(data)
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: number) => {
    await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' })
    setBookmarks(bookmarks.filter(b => b.id !== id))
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-2">
      {bookmarks.map(bookmark => (
        <div key={bookmark.id} className="flex justify-between items-center p-2 border rounded">
          <div>
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {bookmark.title}
            </a>
            <p className="text-sm text-gray-500">{new Date(bookmark.created_at).toLocaleString()}</p>
          </div>
          <button 
            onClick={() => handleDelete(bookmark.id)}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
'use client'

import { useState } from 'react'
import BookmarkList from '@/components/BookmarkList'
import AddBookmarkForm from '@/components/AddBookmarkForm'

export default function Home() {
  const [refreshCount, setRefreshCount] = useState(0)

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Bookmarks</h1>
      <AddBookmarkForm onAdd={() => setRefreshCount(c => c + 1)} />
      <BookmarkList key={refreshCount} />
    </main>
  )
}
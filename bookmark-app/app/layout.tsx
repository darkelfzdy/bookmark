'use client'
import { initBookmarks } from '@/lib/initData'
import { useEffect } from 'react'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    initBookmarks()
  }, [])

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

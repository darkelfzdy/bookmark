import React, { useState } from 'react';
import Head from 'next/head';
import BookmarkList from '../src/components/BookmarkList';
import AddBookmarkForm from '../src/components/AddBookmarkForm';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [bookmarks, setBookmarks] = useState([
    { name: '百度', url: 'https://www.baidu.com' },
    { name: '起点', url: 'https://www.qidian.com' }
  ]);

  const handleAddBookmark = (bookmark) => {
    setBookmarks([...bookmarks, bookmark]);
  };

  const handleDeleteBookmark = (index) => {
    setBookmarks(bookmarks.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>书签管理器</title>
        <meta name="description" content="一个简单的书签管理工具" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>书签管理器</h1>
        <AddBookmarkForm onAdd={handleAddBookmark} />
        <BookmarkList bookmarks={bookmarks} onDelete={handleDeleteBookmark} />
      </main>
    </div>
  );
}
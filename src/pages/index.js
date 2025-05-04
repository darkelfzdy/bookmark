import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookmarks");
      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
      }
      const data = await response.json();
      setBookmarks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (e) => {
    e.preventDefault();
    if (!title || !url) return;

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, url }),
      });
      if (!response.ok) {
        throw new Error("Failed to add bookmark");
      }
      const newBookmark = await response.json();
      setBookmarks([...bookmarks, newBookmark]);
      setTitle("");
      setUrl("");
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteBookmark = async (id) => {
    try {
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete bookmark");
      }
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>简易书签管理</title>
        <meta name="description" content="一个简易的书签管理网站" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <h1>简易书签管理</h1>
          <div>
            <h2>添加书签</h2>
            <form onSubmit={addBookmark} className={styles.ctas}>
              <input
                type="text"
                placeholder="标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                type="url"
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <button type="submit" className={styles.primary}>
                添加书签
              </button>
            </form>
          </div>
          <div>
            <h2>书签列表</h2>
            {loading && <p>加载中...</p>}
            {error && <p>错误: {error}</p>}
            {!loading && !error && bookmarks.length === 0 && (
              <p>暂无书签</p>
            )}
            {!loading && !error && bookmarks.length > 0 && (
              <ul style={{ paddingLeft: 0 }}>
                {bookmarks.map((bookmark) => (
                  <li
                    key={bookmark.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <div>
                      <strong>{bookmark.title}</strong>:{" "}
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {bookmark.url}
                      </a>
                    </div>
                    <button
                      onClick={() => deleteBookmark(bookmark.id)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      删除
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

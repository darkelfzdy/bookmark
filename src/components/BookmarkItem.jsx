import React from 'react';

const BookmarkItem = ({ bookmark, onDelete }) => {
  return (
    <li className="bookmark-item">
      <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
        {bookmark.name}
      </a>
      <button onClick={onDelete}>删除</button>
    </li>
  );
};

export default BookmarkItem;
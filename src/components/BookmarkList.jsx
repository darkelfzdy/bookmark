import React from 'react';
import BookmarkItem from './BookmarkItem';

const BookmarkList = ({ bookmarks, onDelete }) => {
  return (
    <div className="bookmark-list">
      <h2>书签列表</h2>
      {bookmarks.length === 0 ? (
        <p>暂无书签</p>
      ) : (
        <ul>
          {bookmarks.map((bookmark, index) => (
            <BookmarkItem
              key={index}
              bookmark={bookmark}
              onDelete={() => onDelete(index)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookmarkList;
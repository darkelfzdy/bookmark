import React, { useState } from 'react';

const AddBookmarkForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && url) {
      onAdd({ name, url });
      setName('');
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-bookmark-form">
      <h2>添加书签</h2>
      <div>
        <label>名称:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>URL:</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>
      <button type="submit">添加</button>
    </form>
  );
};

export default AddBookmarkForm;
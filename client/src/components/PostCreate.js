import React, { useState } from "react";
import axios from "axios";

const PostCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    await axios.post("https://blog.local/api/posts", {
      title,
      content,
      author,
    });

    setTitle("");
    setContent("");
    setAuthor("");

    window.location.reload();
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Pealkiri</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Sisu</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Autor</label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button className="btn btn-primary">Sisesta</button>
      </form>
    </div>
  );
};

export default PostCreate;

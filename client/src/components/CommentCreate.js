import React, { useState } from "react";
import axios from "axios";

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    await axios.post(`https://blog.local/posts/${postId}/comments`, {
      content,
      author: "Anonymous",
    });
    setContent("");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="comment-form">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control form-control-sm"
            placeholder="New Comment"
            required
          />
        </div>
        <button className="btn btn-primary btn-sm">Submit</button>
      </form>
    </div>
  );
};

export default CommentCreate;

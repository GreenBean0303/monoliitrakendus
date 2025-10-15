import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/posts/${postId}/comments`
        );
        setComments(res.data);
      } catch (error) {
        console.error("Viga kommentaaride laadimisel:", error);
      }
    };

    fetchComments();
  }, [postId]);

  const renderedComments = comments.map((comment) => {
    return <li key={comment.id}>{comment.content}</li>;
  });

  return (
    <div className="comments-section">
      <ul>{renderedComments}</ul>
    </div>
  );
};

export default CommentList;

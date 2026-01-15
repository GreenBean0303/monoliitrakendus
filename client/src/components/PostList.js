import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://blog.local/api/posts");
      console.log("Saadud andmed:", res.data);
      setPosts(res.data);
    } catch (error) {
      console.error("Viga postituste laadimisel:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map((post) => {
    console.log("Renderdame posti:", post);

    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small className="text-muted">Autor: {post.author}</small>
          <hr />
          <h5>Kommentaarid ({post.comments?.length || 0}):</h5>
          <CommentList comments={post.comments || []} />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
};

export default PostList;

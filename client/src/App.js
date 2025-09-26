import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3050/api/posts')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="app">
      <h1>Postituste rakendus</h1>
      {posts.map(post => (
        <div key={post.id} style={{margin: '20px', padding: '10px', border: '1px solid #ccc'}}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>Autor: {post.author}</small>
          <h4>Kommentaarid:</h4>
          {post.comments.map(comment => (
            <div key={comment.id} style={{marginLeft: '20px', padding: '5px'}}>
              <strong>{comment.author}:</strong> {comment.content}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
import "./App.css";

import React from "react";
import PostCreate from "./components/PostCreate";
import PostList from "./components/PostList";

function App() {
  return (
    <div className="container">
      <h1>Loo postitus</h1>
      <PostCreate />
      <hr />
      <h1>Postitused</h1>
      <PostList />
    </div>
  );
}

export default App;

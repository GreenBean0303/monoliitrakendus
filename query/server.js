const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 5002;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

const posts = {};

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  console.log("Sündmus vastu võetud:", type);

  if (type === "PostCreated") {
    const { id, title, content, author } = data;
    posts[id] = {
      id,
      title,
      content,
      author,
      comments: [],
    };
  }

  if (type === "CommentCreated") {
    const { postId, id, content, author } = data;
    const post = posts[postId];
    if (post) {
      post.comments.push({ id, content, author });
    }
  }

  res.send({ status: "OK" });
});

app.get("/api/posts", (req, res) => {
  res.json(posts);
});

app.listen(port, () => {
  console.log(`Query service töötab pordil ${port}`);
});

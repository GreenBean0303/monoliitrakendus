// Juhistes see Posts
const express = require("express");
const app = express();
const port = 3050;
const cors = require("cors");
const axios = require("axios");
app.use(
  cors({
    origin: ["http://localhost:3000", "https://localhost"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// Middleware
app.use(express.json());
let posts = [];
let nextPostId = 1;
let nextCommentId = 1;
app.get("/api/posts", (req, res) => {
  res.json(posts);
});
app.get("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: "Postitust ei leitud" });
  res.json(post);
});
app.post("/api/posts", async (req, res) => {
  const { title, content, author } = req.body;
  const newPost = {
    id: nextPostId++,
    title,
    content,
    author,
    createdAt: new Date(),
    comments: [],
  };
  posts.push(newPost);
  await axios
    .post("http://event-bus:5000/api/events", {
      type: "PostCreated",
      data: newPost,
    })
    .catch((err) => console.log("Viga sündmuse saatmisel:"));
  res.status(201).json(newPost);
});
app.post("/api/events", (req, res) => {
  const { type, data } = req.body;
  console.log("Sündmus vastu võetud:", type);
  res.send({ status: "OK" });
});
app.get("/api/posts/:postId/comments", (req, res) => {
  const postId = parseInt(req.params.postId);
  const post = posts.find((p) => p.id === postId);
  if (!post) return res.status(404).json({ error: "Postitust ei leitud" });
  res.json(post.comments);
});
app.post("/api/posts/:postId/comments", (req, res) => {
  const postId = parseInt(req.params.postId);
  const { content, author } = req.body;
  const post = posts.find((p) => p.id === postId);
  if (!post) return res.status(404).json({ error: "Postitust ei leitud" });
  const newComment = {
    id: nextCommentId++,
    postId: postId,
    author,
    content,
    createdAt: new Date(),
  };
  post.comments.push(newComment);
  res.status(201).json(newComment);
});
app.get("/api/comments", (req, res) => {
  let allComments = [];
  posts.forEach((post) => {
    allComments = allComments.concat(post.comments);
  });
  res.json(allComments);
});
app.get("/api/comments/:commentId", (req, res) => {
  const commentId = parseInt(req.params.commentId);
  let foundComment = null;
  posts.forEach((post) => {
    const comment = post.comments.find((c) => c.id === commentId);
    if (comment) foundComment = comment;
  });
  if (!foundComment)
    return res.status(404).json({ error: "Kommentaari ei leitud" });
  res.json(foundComment);
});
app.listen(port, () => {
  console.log(`Server töötab aadressil http://localhost:${port}`);
});

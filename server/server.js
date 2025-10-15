const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Middleware
app.use(express.json());

let posts = [
  {
    id: 1,
    title: "Esimene postitus",
    content: "See on esimese postituse sisu",
    author: "Kasutaja1",
    createdAt: new Date(),
    comments: [
      {
        id: 1,
        postId: 1,
        author: "Kommenteerija1",
        content: "Hea postitus!",
        createdAt: new Date(),
      },
      {
        id: 2,
        postId: 1,
        author: "Kommenteerija2",
        content: "Nõustun!",
        createdAt: new Date(),
      },
    ],
  },
  {
    id: 2,
    title: "Teine postitus",
    content: "Teine postituse sisu",
    author: "Kasutaja2",
    createdAt: new Date(),
    comments: [],
  },
];

let nextPostId = 3;
let nextCommentId = 3;

// API routes
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

app.get("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: "Postitust ei leitud" });
  res.json(post);
});

app.post("/api/posts", (req, res) => {
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
  res.status(201).json(newPost);
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

// Get all comments from all posts
app.get("/api/comments", (req, res) => {
  let allComments = [];
  posts.forEach((post) => {
    allComments = allComments.concat(post.comments);
  });
  res.json(allComments);
});

// Get a specific comment by ID
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

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const commentsByPostId = {};
let nextCommentId = 1;

app.get("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;
  const comments = commentsByPostId[postId] || [];
  res.json(comments);
});

app.post("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const { content, author } = req.body;

  const comment = {
    id: nextCommentId++,
    content,
    author: author || "Anonymous",
    postId: postId,
    createdAt: new Date(),
  };

  if (!commentsByPostId[postId]) {
    commentsByPostId[postId] = [];
  }

  commentsByPostId[postId].push(comment);

  await axios
    .post("http://localhost:5000/api/events", {
      type: "CommentCreated",
      data: comment,
    })
    .catch((err) => {
      console.log("Viga sündmuse saatmisel:", err.message);
    });

  res.status(201).json(comment);
});

app.get("/comments", (req, res) => {
  res.json(commentsByPostId);
});

app.post("/events", (req, res) => {
  console.log("Sündmus vastu võetud:", req.body);
  res.json({});
});

app.listen(port, () => {
  console.log(`Comments service töötab pordil ${port}`);
});

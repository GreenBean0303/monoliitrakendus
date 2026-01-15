const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 5003;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://localhost"],
    credentials: true,
  })
);

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
    console.log("Postitus lisatud:", posts[id]);
  }

  if (type === "CommentCreated") {
    const { postId, id, content, author, status } = data;
    const post = posts[postId] || posts[String(postId)];

    console.log("PostId:", postId, "Post leitud:", !!post);

    if (post) {
      post.comments.push({ id, content, author, status });
      console.log("Kommentaar lisatud:", post.comments);
    } else {
      console.log("VIGA: Postitust ei leitud!");
    }
  }

  if (type === "CommentUpdated") {
    const { postId, id, status } = data;
    const post = posts[postId] || posts[String(postId)];

    if (post) {
      const comment = post.comments.find(
        (c) => c.id === id || c.id === Number(id)
      );
      if (comment) {
        comment.status = status;
        console.log("Kommentaari staatus uuendatud:", comment);
      } else {
        console.log("VIGA: Kommentaari ei leitud! ID:", id);
      }
    } else {
      console.log("VIGA: Postitust ei leitud! PostId:", postId);
    }
  }

  res.send({ status: "OK" });
});

app.get("/api/posts", (req, res) => {
  console.log("GET /api/posts - tagastame:", posts);
  res.json(posts);
});

app.listen(port, () => {
  console.log(`Query service töötab pordil ${port}`);
});

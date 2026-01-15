const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = 4000;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://localhost"],
    credentials: true,
  })
);
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
    status: "pending",
    createdAt: new Date(),
  };

  if (!commentsByPostId[postId]) {
    commentsByPostId[postId] = [];
  }

  commentsByPostId[postId].push(comment);

  await axios
    .post("http://event-bus:5000/api/events", {
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

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  console.log("Sündmus vastu võetud:", type);

  if (type === "CommentModerated") {
    const { id, status, postId } = data;

    const comments =
      commentsByPostId[postId] || commentsByPostId[String(postId)];

    if (comments) {
      const comment = comments.find((c) => c.id === id || c.id === Number(id));

      if (comment) {
        comment.status = status;

        console.log(`Kommentaar ${id} staatus uuendatud: ${status}`);

        await axios
          .post("http://event-bus:5000/api/events", {
            type: "CommentUpdated",
            data: comment,
          })
          .catch((err) => {
            console.log("Viga sündmuse saatmisel:", err.message);
          });
      } else {
        console.log("VIGA: Kommentaari ei leitud! ID:", id);
      }
    } else {
      console.log("VIGA: Postitust ei leitud! PostId:", postId);
    }
  }

  res.send({ status: "OK" });
});

app.listen(port, () => {
  console.log(`Comments service töötab pordil ${port}`);
});

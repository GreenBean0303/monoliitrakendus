const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = 4000;

const allowedOrigins = [
  "https://blog.local",
  "http://blog.local",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked: " + origin));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

app.use(cors(corsOptions));
app.use(express.json());

//ADD AUTHENTICATION MIDDLEWARE
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token puudub" });
  }

  const token = authHeader.substring(7);

  try {
    // Ask auth service to verify the token
    const response = await axios.post(
      "http://auth:5006/auth/verify",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.valid) {
      req.user = response.data.user;
      next();
    } else {
      return res.status(403).json({ error: "Kehtetu token" });
    }
  } catch (error) {
    console.log("Token verification error:", error.message);
    return res.status(403).json({ error: "Token verification failed" });
  }
};
// =END AUTHENTICATION MIDDLEWARE

const commentsByPostId = {};
let nextCommentId = 1;

app.get("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;
  const comments = commentsByPostId[postId] || [];
  res.json(comments);
});

// PROTECTED ROUTE
app.post("/posts/:id/comments", authenticateToken, async (req, res) => {
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
    .post("http://event-bus:5000/events", {
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
          .post("http://event-bus:5000/events", {
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

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5003;

app.use(express.json());

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

const posts = {};

const handleEvent = (type, data) => {
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
};

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log("Sündmus vastu võetud:", type);
  handleEvent(type, data);
  res.send({ status: "OK" });
});

app.get("/api/posts", (req, res) => {
  console.log("GET /api/posts - tagastame:", Object.values(posts));
  res.json(Object.values(posts));
});

// Sync all events from event-bus on startup
const syncEvents = async () => {
  try {
    console.log("Sünkroniseerin sündmusi event-busist...");
    const res = await axios.get("http://event-bus:5000/events");

    console.log(`Leitud ${res.data.length} sündmust`);

    for (let event of res.data) {
      console.log("Töötlen sündmust:", event.type);
      handleEvent(event.type, event.data);
    }

    console.log(
      "Sünkroniseerimine lõpetatud. Postitusi:",
      Object.keys(posts).length
    );
  } catch (error) {
    console.log("Sünkroniseerimisel tekkis viga:", error.message);
  }
};

app.listen(port, async () => {
  console.log(`Query service töötab pordil ${port}`);
  await syncEvents();
});

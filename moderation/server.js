const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 5002;

app.use(cors());
app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  console.log("Sündmus vastu võetud:", type);

  if (type === "CommentCreated") {
    const { id, content, postId, author } = data;

    const status = content.includes("fuck") ? "rejected" : "approved";

    console.log(`Kommentaar ${id} modereeritud: ${status}`);

    await axios
      .post("http://event-bus:5000/api/events", {
        type: "CommentModerated",
        data: {
          id,
          postId,
          status,
          content,
          author,
        },
      })
      .catch((err) => {
        console.log("Viga sündmuse saatmisel:", err.message);
      });
  }

  res.send({ status: "OK" });
});

app.listen(port, () => {
  console.log(`Moderation service töötab pordil ${port}`);
});

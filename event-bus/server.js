const express = require("express");
const axios = require("axios");
const app = express();
const port = 5000;
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:3000", "https://localhost"],
    credentials: true,
  })
);

app.use(express.json());

let events = [];

app.get("/api/events", (req, res) => {
  res.json(events);
});

app.post("/api/events", async (req, res) => {
  const event = req.body;
  events.push(event);
  console.log("Sündmus vastu võetud:", event.type);

  try {
    await axios.post("http://localhost:3050/api/events", event);
    console.log("Posts - OK");
  } catch (err) {
    console.log("Posts viga:", err.message);
  }

  try {
    await axios.post("http://localhost:4000/events", event);
    console.log("Comments - OK");
  } catch (err) {
    console.log("Comments viga:", err.message);
  }

  try {
    await axios.post("http://localhost:5002/events", event);
    console.log("Moderation - OK");
  } catch (err) {
    console.log("Moderation viga:", err.message);
  }

  try {
    await axios.post("http://localhost:5003/events", event);
    console.log("Query - OK");
  } catch (err) {
    console.log("Query viga:", err.message);
  }

  res.status(201).json({ status: "OK" });
});

app.listen(port, () => {
  console.log(`Event bus töötab pordil ${port}`);
});

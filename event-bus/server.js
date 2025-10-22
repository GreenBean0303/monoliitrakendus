const express = require("express");
const axios = require("axios");
const app = express();
const port = 5000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

let events = [];

app.get("/api/events", (req, res) => {
  res.json(events);
});

app.post("/api/events", async (req, res) => {
  const event = req.body;
  events.push(event);

  console.log("Sündmus vastu võetud:", event.type);

  axios.post("http://localhost:3050/api/events", event).catch((err) => {
    console.log("Viga posts teenusele saatmisel:", err.message);
  });

  axios.post("http://localhost:4000/events", event).catch((err) => {
    console.log("Viga comments teenusele saatmisel:", err.message);
  });

  axios.post("http://localhost:5002/events", event).catch((err) => {
    console.log("Viga query teenusele saatmisel:", err.message);
  });

  axios.post("http://localhost:5003/events", event).catch((err) => {
    console.log("Viga moderation teenusele saatmisel:", err.message);
  });

  res.status(201).json({ status: "OK" });
});

app.listen(port, () => {
  console.log(`Event bus töötab pordil ${port}`);
});

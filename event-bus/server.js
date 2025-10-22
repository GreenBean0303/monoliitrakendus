const express = require("express");
const app = express();
const port = 5000;
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

let events = [];

app.get("/api/events", (req, res) => {
  res.json(events);
});

app.post("/api/events", (req, res) => {
  const event = req.body;
  events.push(event);
  console.log("Sündmus salvestatud:", event);
  res.status(201).json({ status: "OK" });
});

axios.post("http://localhost:3050/api/events", event).catch((err) => {
  console.log("Viga sündmuse saatmisel:", err.message);
});

axios.post("http://localhost:5000/api/events", event).catch((err) => {
  console.log("Viga sündmuse saatmisel:", err.message);
});

app.listen(port, () => {
  console.log(`Event bus töötab pordil ${port}`);
});

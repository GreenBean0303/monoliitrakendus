const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const port = 5006;

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

// Secret key for signing tokens (in production, use environment variable!)
const SECRET_KEY = "my-super-secret-key-change-in-production";
const REFRESH_SECRET = "my-refresh-secret-key";

// Dummy user database
const users = [
  { id: 1, username: "admin", password: "admin123" },
  { id: 2, username: "user", password: "user123" },
];

// Store of valid refresh tokens (in production, use Redis or database)
let refreshTokens = [];

// User gets their magic bracelet here!
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  console.log("Login katse:", username);

  // Find user
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Vale kasutajanimi või parool" });
  }

  // Create access token (expires in 15 minutes)
  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: "15m" }
  );

  // Create refresh token (expires in 7 days)
  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  // Store refresh token
  refreshTokens.push(refreshToken);

  console.log("Login edukas:", user.username);

  res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, username: user.username },
  });
});

// Get a new bracelet when the old one expires!
app.post("/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token puudub" });
  }

  // Check if refresh token exists
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ error: "Kehtetu refresh token" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    // Create new access token
    const accessToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      SECRET_KEY,
      { expiresIn: "15m" }
    );

    console.log("Token uuendatud:", decoded.username);

    res.json({ accessToken });
  } catch (error) {
    return res.status(403).json({ error: "Kehtetu refresh token" });
  }
});

// LOGOUT
// Return the bracelet and leave!
app.post("/auth/logout", (req, res) => {
  const { refreshToken } = req.body;

  // Remove refresh token from store
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

  console.log("Logout edukas");

  res.json({ message: "Logout edukas" });
});

// VERIFY TOKEN
// Check if someone's bracelet is real!
// Other services will call this endpoint
app.post("/auth/verify", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token puudub" });
  }

  const token = authHeader.substring(7); // Remove "Bearer "

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    console.log("Token verifitseeritud:", decoded.username);

    res.json({
      valid: true,
      user: { id: decoded.id, username: decoded.username },
    });
  } catch (error) {
    console.log("Token kehtetu:", error.message);
    return res.status(403).json({ error: "Kehtetu token" });
  }
});

// TEST ENDPOINT
// Protected endpoint to test authentication
app.get("/auth/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token puudub" });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ user: decoded });
  } catch (error) {
    return res.status(403).json({ error: "Kehtetu token" });
  }
});

app.listen(port, () => {
  console.log(`Auth service töötab pordil ${port}`);
});

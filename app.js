const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// In-memory "database"
let entries = [];
let nextId = 1;

const SECRET = "supersecretkey123"; // move to env later

// Public routes
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Login route
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@example.com" && password === "password123") {
    const token = jwt.sign({ email }, SECRET, { expiresIn: "1d" });
    return res.json({ token });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

// Auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ---------------------------
// PROTECTED ROUTES BELOW
// ---------------------------

// Toggle status
app.patch("/api/data/:id/status", authMiddleware, (req, res) => {
  const ticketId = parseInt(req.params.id);
  const ticket = entries.find((t) => t.id === ticketId);

  if (!ticket) return res.status(400).json({ error: "Ticket not found" });

  const statuses = ["Open", "In Progress", "Done"];
  const currentIndex = statuses.indexOf(ticket.status);
  const nextStatus = statuses[(currentIndex + 1) % statuses.length];

  ticket.status = nextStatus;

  res.json({ message: "Status updated", ticket });
});

// Toggle tags
app.patch("/api/data/:id/tags", authMiddleware, (req, res) => {
  const ticketId = parseInt(req.params.id);
  const { tag } = req.body;

  const ticket = entries.find((t) => t.id === ticketId);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  const currentTags = ticket.tags || [];

  if (currentTags.includes(tag)) {
    ticket.tags = currentTags.filter((t) => t !== tag);
  } else {
    ticket.tags = [...currentTags, tag];
  }

  res.json({ message: "Tag updated", ticket });
});

// Create ticket
app.post("/api/data", authMiddleware, (req, res) => {
  const {
    name,
    email,
    message,
    timestamp,
    status = "Open",
    tags = [],
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const newEntry = {
    id: nextId++,
    name,
    email,
    message,
    timestamp,
    status,
    tags,
  };

  entries.push(newEntry);

  res.json({ message: "Data received!", data: newEntry });
});

// Get tickets
app.get("/api/data", authMiddleware, (req, res) => {
  const { tag } = req.query;

  const filtered = tag
    ? entries.filter((entry) =>
        entry.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
      )
    : entries;

  res.json({ entries: filtered });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

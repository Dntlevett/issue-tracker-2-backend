const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// In-memory "database"
let entries = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// clickable status toggle
app.patch("/api/data/:id/status", (req, res) => {
  const ticketId = parseInt(req.params.id);
  const ticket = entries.find((t) => t.id === ticketId);
  if (!ticket) return res.status(404).json({ erro: "Ticket not found" });

  const statuses = ["Open", "In Progress", "Done"];
  const currentIndex = statuses.indexOf(ticket.status);
  const nextStatus = statuses[(currentIndex + 1) % statuses.length];
  ticket.status = nextStatus;
  res.json({ message: "Status updated", ticket });
});

// post tickets and add time stamp

app.post("/api/data", (req, res) => {
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
  console.log("New Entry:", newEntry);

  res.json({ message: "Data received!", data: newEntry });
});

// Optional: Retrieve all entries
// app.get("/api/data", (req, res) => {
//   res.json({ entries });
// });
// app.get("/api/data", (req, res) => {
//   const { tag } = req.query;
//   const filtered = tag
//     ? entries.filter((entry) => entry.tags?.includes(tag))
//     : entries;
//   res.json({ entries: filtered });
// });
app.get("/api/data", (req, res) => {
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

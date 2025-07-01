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

app.post("/api/data", (req, res) => {
  const { name, email, message, timestamp } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const newEntry = {
    id: nextId++,
    name,
    email,
    message,
    timestamp,
  };

  entries.push(newEntry);
  console.log("New Entry:", newEntry);

  res.json({ message: "Data received!", data: newEntry });
});

// Optional: Retrieve all entries
app.get("/api/data", (req, res) => {
  res.json({ entries });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

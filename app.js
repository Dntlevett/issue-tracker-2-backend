console.log("Hello, Node.js!");
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
// const express = require("express");

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.post("/api/data", (req, res) => {
  console.log(req.body);
  res.json({ message: "Data received!", data: req.body });
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const jwt = require("jsonwebtoken");
// exports.login = (req, res) => {
//   const { email, password } = req.body;
//   if (email === "admin@example.com" && password === "password123") {
//     const token = jwt.sign({ email }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });
//     return res.json({ token });
//   }
//   res.status(401).json({ error: "Invalid credentials" });
// };

// const express = require("express");
// const jwt = require("jsonwebtoken");
// const router = express.Router();

// const SECRET = "supersecretkey123"; // move to env later

// router.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   if (email === "admin@example.com" && password === "password123") {
//     const token = jwt.sign({ email }, SECRET, { expiresIn: "1d" });
//     return res.json({ token });
//   }

//   return res.status(401).json({ error: "Invalid credentials" });
// });

// module.exports = router;

const jwt = require("jsonwebtoken");
exports.login = (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@example.com" && password === "password123") {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: "1d" }
    );
    return res.json({ token });
  }
  return res.status(401).json({ error: "Invalid credentials" });
};

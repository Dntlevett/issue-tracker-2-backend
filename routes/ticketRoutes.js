const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getTickets,
  createTicket,
  toggleStatus,
  toggleTag,
} = require("../controllers/ticketController");
router.get("/", auth, getTickets);
router.post("/", auth, createTicket);
router.patch("/:id/status", auth, toggleStatus);
router.patch("/:id/tags", auth, toggleTag);
module.exports = router;

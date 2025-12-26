const db = require("../db");

exports.getTickets = async (req, res) => {
  const { tag } = req.query;

  let query = db("tickets");

  if (tag) {
    query = query.where("tags", "LIKE", `%${tag}%`);
    // .whereRaw("JSON_CONTAINS(tags, ?)", [`"${tag}"`]);
  }

  //   const entries = await query.select();
  const rows = await query.select();
  const entries = rows.map((row) => ({
    ...row,
    tags: JSON.parse(row.tags || "[]"),
  }));
  res.json({ entries });
};

exports.createTicket = async (req, res) => {
  const { name, email, message, timestamp, status, tags } = req.body;

  const [id] = await db("tickets").insert({
    name,
    email,
    message,
    status,
    tags: JSON.stringify(tags),
    created_at: new Date(),
  });

  const newTicket = await db("tickets").where({ id }).first();
  res.json({ message: "Ticket created", data: newTicket });
};

exports.toggleStatus = async (req, res) => {
  const id = req.params.id;

  const ticket = await db("tickets").where({ id }).first();
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  const statuses = ["Open", "In Progress", "Done"];
  const nextStatus =
    statuses[(statuses.indexOf(ticket.status) + 1) % statuses.length];

  await db("tickets").where({ id }).update({ status: nextStatus });

  const updated = await db("tickets").where({ id }).first();
  res.json({ message: "Status updated", ticket: updated });
};

exports.toggleTag = async (req, res) => {
  const id = req.params.id;
  const { tag } = req.body;

  const ticket = await db("tickets").where({ id }).first();
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  const currentTags = JSON.parse(ticket.tags || "[]");

  const updatedTags = currentTags.includes(tag)
    ? currentTags.filter((t) => t !== tag)
    : [...currentTags, tag];

  await db("tickets")
    .where({ id })
    .update({
      tags: JSON.stringify(updatedTags),
    });

  const updated = await db("tickets").where({ id }).first();
  res.json({ message: "Tag updated", ticket: updated });
};

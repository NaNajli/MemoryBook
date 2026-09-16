const express = require("express");
const router = express.Router();
const auth = require("../auth/authMiddleware");
const pool = require("../database");

router.get("/", auth, async (req, res) => {
  const result = await pool.query("SELECT * FROM topics WHERE owner_id = $1", [req.user.id]);
  res.json(result.rows);
});

router.post("/", auth, async (req, res) => {
  const { title } = req.body;
  const result = await pool.query(
    "INSERT INTO topics (owner_id, title) VALUES ($1, $2) RETURNING *",
    [req.user.id, title]
  );
  res.json(result.rows[0]);
});

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../auth/authMiddleware");
const pool = require("../database");

router.get("/:topicId", auth, async (req, res) => {
  const result = await pool.query("SELECT * FROM photos WHERE topic_id = $1", [req.params.topicId]);
  res.json(result.rows);
});

router.post("/:topicId", auth, async (req, res) => {
  const { url, description } = req.body;
  const result = await pool.query(
    "INSERT INTO photos (topic_id, url, description, uploaded_by) VALUES ($1, $2, $3, $4) RETURNING *",
    [req.params.topicId, url, description, req.user.id]
  );
  res.json(result.rows[0]);
});

module.exports = router;

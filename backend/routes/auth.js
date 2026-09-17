const express = require("express");
const router = express.Router();
const pool = require("../database");
const { register, login } = require("../auth/authController");

router.get("/", (req, res) => {
  res.json({
    message: "Auth route is working"
  });
});

router.get("/dbtest", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.post("/register", register);
router.post("/login", login);

module.exports = router;
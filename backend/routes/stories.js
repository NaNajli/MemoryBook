const express = require("express");
const router = express.Router();
const generateStory = require("../ai/generateStory");

router.post("/:topicId", async (req, res) => {
  const story = await generateStory(req.params.topicId);
  res.json({ content: story });
});

module.exports = router;

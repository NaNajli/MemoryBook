const express = require("express");
const router = express.Router();
const generatePdf = require("../pdf/generatePdf");

router.get("/:topicId", async (req, res) => {
  const pdfBytes = await generatePdf(req.params.topicId);
  res.setHeader("Content-Type", "application/pdf");
  res.send(pdfBytes);
});

module.exports = router;

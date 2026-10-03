const { PDFDocument, StandardFonts } = require("pdf-lib");
const pool = require("../database");

async function generatePdf(topicId) {
  // Create PDF document
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Fetch topic
  const topicRes = await pool.query("SELECT * FROM topics WHERE id = $1", [topicId]);
  const topic = topicRes.rows[0];

  // Fetch story
  const storyRes = await pool.query("SELECT * FROM stories WHERE topic_id = $1", [topicId]);
  const story = storyRes.rows[0]?.content || "No story yet.";

  // Fetch photos
  const photosRes = await pool.query("SELECT * FROM photos WHERE topic_id = $1", [topicId]);
  const photos = photosRes.rows;

  // Cover page
  let page = pdfDoc.addPage();
  page.drawText(topic.title, {
    x: 50,
    y: 700,
    size: 30,
    font
  });

  // Story page
  page = pdfDoc.addPage();
  page.drawText("Story", { x: 50, y: 700, size: 24, font });

  let y = 660;
  wrapText(story, 80).forEach(line => {
    page.drawText(line, { x: 50, y, size: 12, font });
    y -= 16;
  });

  // Photo pages
  photos.forEach(photo => {
    const p = pdfDoc.addPage();
    p.drawText("Photo Description:", { x: 50, y: 700, size: 16, font });

    let y = 660;
    wrapText(photo.description || "", 80).forEach(line => {
      p.drawText(line, { x: 50, y, size: 12, font });
      y -= 16;
    });
  });

  return pdfDoc.save();
}

// Helper function to wrap text
function wrapText(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let current = "";

  words.forEach(word => {
    if ((current + " " + word).trim().length > maxChars) {
      lines.push(current.trim());
      current = word;
    } else {
      current += " " + word;
    }
  });

  if (current.trim()) lines.push(current.trim());
  return lines;
}

module.exports = generatePdf;

const pool = require("../database");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateStory(topicId) {
  const topicRes = await pool.query("SELECT * FROM topics WHERE id = $1", [topicId]);
  const topic = topicRes.rows[0];

  const photosRes = await pool.query("SELECT * FROM photos WHERE topic_id = $1", [topicId]);
  const photos = photosRes.rows;

  const prompt = buildPrompt(topic, photos);

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Write warm family stories." },
      { role: "user", content: prompt }
    ]
  });

  const storyText = response.choices[0].message.content;

  await pool.query(
    "INSERT INTO stories (topic_id, content) VALUES ($1, $2) ON CONFLICT (topic_id) DO UPDATE SET content = $2",
    [topicId, storyText]
  );

  return storyText;
}

function buildPrompt(topic, photos) {
  let prompt = `Write a warm story about "${topic.title}".\n\nPhotos:\n`;
  photos.forEach((p, i) => {
    prompt += `${i + 1}. ${p.description || "No description"}\n`;
  });
  return prompt;
}

module.exports = generateStory;

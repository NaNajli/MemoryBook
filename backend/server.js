// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const topicRoutes = require("./routes/topics");
const photoRoutes = require("./routes/photos");
const storyRoutes = require("./routes/stories");
const pdfRoutes = require("./routes/pdf");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/pdf", pdfRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("MemoryBook backend is running successfully!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

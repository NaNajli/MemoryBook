const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth");
const topicRoutes = require("./routes/topics");
const photoRoutes = require("./routes/photos");

// TEMPORARILY DISABLED UNTIL OPENAI IS CONFIGURED
// const storyRoutes = require("./routes/stories");

const pdfRoutes = require("./routes/pdf");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/photos", photoRoutes);

// TEMPORARILY DISABLED
// app.use("/api/stories", storyRoutes);

app.use("/api/pdf", pdfRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("MemoryBook backend is running successfully!");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
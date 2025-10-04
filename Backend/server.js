const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config(); // Load environment variables

const supabase = require("./config/supabase");
const taskRoutes = require("./routes/taskRoutes");
const aiRoutes = require("./routes/aiRoute");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

// Routes
app.use("/tasks", taskRoutes);
app.use("/ai", aiRoutes);
app.use("/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.send("Server Health is good.");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

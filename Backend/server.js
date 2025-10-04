const dotenv = require("dotenv");
const express = require("express");
dotenv.config();
const supabase = require("./config/supabase");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const aiRoutes = require('./routes/aiRoute');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);
app.use('/ai', aiRoutes);
app.use('/auth', authRoutes);

app.get("/health", (req, res) => {
  res.send("Server Health is good.");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log("Server is Running on port", PORT);
});

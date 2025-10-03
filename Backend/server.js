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
  res.send(" Server Health is good.");
});
app.listen(PORT, () => {
  console.log("Server is Running");
});

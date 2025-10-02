const dotenv = require("dotenv")
const express = require("express");
dotenv.config();
const supabase = require("./config/supabase");
const app = express();
const PORT = 3000;
app.get("/health", (req, res) => {
  res.send(" Server Health is good.");
});
app.listen(PORT, () => {
  console.log("Server is Running");
});

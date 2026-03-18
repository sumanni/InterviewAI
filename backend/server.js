// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());


app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.json({ message: "InterviewAI API is running ✅" });
});


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

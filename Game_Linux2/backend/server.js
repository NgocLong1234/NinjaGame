require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 📌 Kết nối MongoDB
mongoose.connect("process.env,MONGO_URI", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/auth', require('./routes/auth'));
app.use('/leaderboard', require('./routes/users'));

// 📌 Định nghĩa Schema và Model
const ScoreSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Score = mongoose.model("Score", ScoreSchema);

// Kết nối đến server
app.get("/", (req, res) => {
    res.send("Chào mừng đến với API của Ninja Frog!");
  });
  

// 📌 API GET điểm số (Lấy danh sách điểm số cao nhất)
app.get("/api/score", async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 }).limit(10);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 API POST điểm số (Lưu điểm số của người chơi)
app.post("/api/score", async (req, res) => {
  try {
    const { playerName, score } = req.body;
    if (!playerName || !score) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newScore = new Score({ playerName, score });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

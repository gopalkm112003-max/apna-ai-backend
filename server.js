import express from "express";
import cors from "cors";

const app = express();

/* 🔓 FULL CORS OPEN (Weebly + browser ke liye) */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

/* ✅ ROOT CHECK */
app.get("/", (req, res) => {
  res.send("Apna AI backend is running 🚀");
});

/* ✅ CHAT API */
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "Message missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error" });
  }
});

/* 🔌 RENDER PORT FIX */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Apna AI backend running on port", PORT);
});


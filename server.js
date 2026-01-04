import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/* Root test */
app.get("/", (req, res) => {
  res.send("✅ Apna AI backend is running 🚀");
});

/* Chat API */
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No reply from AI";

    res.json({ reply });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI server error" });
  }
});

/* Render port fix */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Apna AI backend running on port", PORT);
});


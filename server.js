import express from "express";
import cors from "cors";

const app = express();

/* CORS */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Apna AI backend is running 🚀");
});

/* CHAT ROUTE */
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Message empty hai" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: userMessage }] }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI se reply nahi mila";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

/* PORT (Render fix) */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Apna AI backend running on port", PORT);
});


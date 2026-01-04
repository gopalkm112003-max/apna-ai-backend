import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ HOME ROUTE (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("Apna AI backend is running 🚀");
});

// ✅ CHAT ROUTE
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
        }),
      }
    );

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PORT FIX (RENDER REQUIRED)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Apna AI backend running on port", PORT);
});


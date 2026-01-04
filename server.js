import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Apna AI backend is running 🚀");
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body?.message;

  if (!userMessage) {
    return res.json({ reply: "Message empty hai" });
  }

  try {
    const apiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }]
            }
          ]
        })
      }
    );

    const data = await apiRes.json();

    // 🔥 DEBUG LINE (VERY IMPORTANT)
    console.log("Gemini raw response:", JSON.stringify(data));

    if (data.error) {
      return res.json({
        reply: "Gemini error: " + data.error.message
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({
      reply: reply || "Gemini se empty reply aaya"
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.json({ reply: "Internal server error" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Apna AI backend running on port " + PORT);
});

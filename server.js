import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/* ✅ ROOT ROUTE (Browser test) */
app.get("/", (req, res) => {
  res.send("✅ Apna AI backend is running 🚀");
});

/* ✅ CHAT API */
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
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
      "No reply from AI";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI server error" });
  }
});

/* ✅ PORT FIX (Render compatible) */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Apna AI backend running on port", PORT);
});

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

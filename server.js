const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Frontend files serve karne ke liye
app.use(express.static(path.join(__dirname, '.')));

// Render par PORT environment variable se milta hai
const PORT = process.env.PORT || 3000;

// API Route
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: "API Key not configured in Render!" });
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: message }] }]
            }
        );

        const aiReply = response.data.candidates[0].content.parts[0].text;
        res.json({ reply: aiReply });
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "AI se baat karne mein galti hui." });
    }
});

// index.html serve karein
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

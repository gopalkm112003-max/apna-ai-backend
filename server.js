const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Frontend files serve karne ke liye
app.use(express.static(__dirname));

const PORT = process.env.PORT || 10000;

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: "API Key missing in Render settings!" });
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                contents: [{ parts: [{ text: message }] }]
            }
        );

        if (response.data && response.data.candidates) {
            const aiReply = response.data.candidates[0].content.parts[0].text;
            res.json({ reply: aiReply });
        } else {
            res.status(500).json({ error: "Invalid response from Google API" });
        }

    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ error: "AI link failure: " + error.message });
    }
});

// Saari requests par index.html dikhao
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

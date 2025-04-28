const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GENKIT_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// API endpoint to fetch project name
app.get('/api/name', (req, res) => {
    res.json({ name: 'persona grata' });
});

// Project recommendation endpoint
app.post('/api/recommendations', async (req, res) => {
    try {
        if (!req.body || !req.body.topic) {
            return res.status(400).json({ error: 'Topic is required in the request body' });
        }

        const { topic } = req.body;
        
        if (typeof topic !== 'string' || topic.trim().length === 0) {
            return res.status(400).json({ error: 'Topic must be a non-empty string' });
        }

        const prompt = `Generate 3 project recommendations for the topic: ${topic}. 
        For each project include:
        - Project name
        - Brief description
        - Key technologies
        - Difficulty level (Beginner/Intermediate/Advanced)
        - Estimated time to complete`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        res.json({ recommendations: response.text() });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

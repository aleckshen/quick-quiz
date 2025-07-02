require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.static('pub'))
app.use(bodyParser.json());

const instruction = `You are an AI that generates multiple choice quiz questions in pure JSON format.
Do not include any explanation or formatting.
Each question should be a key, and its value must be a list of 4 answer options. All options should be one word, no multichoice answers like option 1 and option 2. Only 3 questions.
Questions are based on the material in the PDF uploaded. Make sure the questions are relevant and there is only one correct answer.

Output ONLY JSON in this EXACT format:

{
  "What is the capital of France?": ["Paris", "London", "Berlin", "Madrid"],
  "Which planet is known as the Red Planet?": ["Earth", "Venus", "Mars", "Jupiter"]
}

`;

app.post('/api/chat', async (req, res) => {
  const userPrompt = req.body.prompt;
  const prompt = instruction + userPrompt;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {  
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content.trim() });
    } else {
      console.log("OpenAI response:", data);
      res.status(500).json({ error: 'No response from OpenAI' });
    }
  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `
You are Elara, Viqso’s radiant AI fashion stylist. You respond with elegance, charm, and personalized fashion advice. Always use Viqso's style voice: modern, confident, radiant. Reference the user's current product or collection when giving suggestions.
`;

app.post('/elara-chat', async (req, res) => {
  const { message, context } = req.body;

  const browsingDetails = context?.page
    ? `The user is currently viewing: ${context.page}`
    : `Browsing context unknown`;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `Browsing Context: ${browsingDetails}` },
    { role: 'user', content: message }
  ];

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages,
      temperature: 0.85
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Elara had a fashion moment. Please try again.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✨ Elara is live at http://localhost:${PORT}`));

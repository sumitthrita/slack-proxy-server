const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test/run-agent'; // Change this to your actual n8n webhook URL

app.post('/slack/webhook', async (req, res) => {
  if (req.body.type === 'url_verification') {
    return res.json({ challenge: req.body.challenge });
  }

  try {
    // Forward all other requests to n8n webhook
    await axios.post(N8N_WEBHOOK_URL, req.body);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error forwarding to n8n:', error.message);
    res.status(500).send('Failed to forward');
  }
});

app.get('/home', (req, res) => {
  res.json({ success: true, message: "Welcome to the home endpoint" });
});

app.listen(port, () => {
  console.log(`Slack proxy server running on http://localhost:${port}/home`);
});

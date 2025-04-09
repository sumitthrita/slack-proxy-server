const express = require('express');
const axios = require('axios');
const app = express();

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

const port = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Slack proxy server running on http://localhost:${PORT}/slack/webhook`);
});

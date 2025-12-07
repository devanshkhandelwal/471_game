const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Serve static files from current directory (for index.html)
app.use(express.static(__dirname));

// Initialize leaderboard file if it doesn't exist
async function initLeaderboard() {
  try {
    await fs.access(LEADERBOARD_FILE);
  } catch {
    await fs.writeFile(LEADERBOARD_FILE, JSON.stringify([]), 'utf8');
  }
}

// GET /api/scores - Get all scores
app.get('/api/scores', async (req, res) => {
  try {
    const data = await fs.readFile(LEADERBOARD_FILE, 'utf8');
    const scores = JSON.parse(data);
    // Sort by delta (highest first)
    scores.sort((a, b) => b.delta - a.delta);
    res.json(scores);
  } catch (error) {
    console.error('Error reading scores:', error);
    res.status(500).json({ error: 'Failed to read scores' });
  }
});

// POST /api/scores - Add a new score
app.post('/api/scores', async (req, res) => {
  try {
    const { name, round1Score, round2Score } = req.body;
    
    if (!name || round1Score === null || round2Score === null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = await fs.readFile(LEADERBOARD_FILE, 'utf8');
    const scores = JSON.parse(data);

    const newEntry = {
      id: Date.now(),
      name: name.trim(),
      round1Score: parseInt(round1Score),
      round2Score: parseInt(round2Score),
      delta: parseInt(round2Score) - parseInt(round1Score),
      timestamp: new Date().toISOString()
    };

    scores.push(newEntry);
    await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(scores, null, 2), 'utf8');

    res.json({ success: true, entry: newEntry });
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve leaderboard.html for /leaderboard route
app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'leaderboard.html'));
});

// Start server
async function startServer() {
  await initLeaderboard();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();


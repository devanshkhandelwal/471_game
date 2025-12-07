# A-B Effort Game

A behavioral economics demo game where users alternate pressing A and B keys as fast as possible.

## Quick Start (Local Development)

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open http://localhost:3000 in your browser

The leaderboard will be stored in `leaderboard.json` (created automatically on first run).

## Deployment Options

### Option 1: Render (Easiest - Recommended)

1. Create a free account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (or push this code to GitHub first)
4. Configure:
   - **Name**: ab-effort-game (or any name)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click "Create Web Service"
6. Your app will be live at `https://your-app-name.onrender.com`

**Note**: Free tier may spin down after inactivity, but will wake up on first request.

### Option 2: Railway

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Node.js and deploys
5. Your app will be live automatically

### Option 3: Heroku

1. Install Heroku CLI: `brew install heroku/brew/heroku` (Mac) or [download](https://devcenter.heroku.com/articles/heroku-cli)
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Deploy: `git push heroku main`
5. Your app will be live at `https://your-app-name.herokuapp.com`

### Option 4: Local Network (For Class)

If you want to run it locally and share on your local network:

1. Start the server: `npm start`
2. Find your local IP:
   - Mac: `ipconfig getifaddr en0` or check System Preferences → Network
   - Windows: `ipconfig` (look for IPv4 Address)
3. Share the URL: `http://YOUR_IP:3000` (e.g., `http://192.168.1.100:3000`)
4. Make sure your firewall allows connections on port 3000

## How It Works

- **Frontend**: React app in `index.html`
- **Backend**: Express server in `server.js`
- **Storage**: Leaderboard stored in `leaderboard.json` file
- **API Endpoints**:
  - `GET /api/scores` - Get all scores
  - `POST /api/scores` - Save a new score

## Features

- Two rounds: Round 1 (no incentive) and Round 2 (with prize incentive)
- Real-time leaderboard that updates every 5 seconds
- Shared leaderboard across all players
- Simple file-based storage (no database needed)

## Notes

- Leaderboard refreshes automatically every 5 seconds
- All scores are stored in `leaderboard.json` (created automatically)
- No authentication - anyone can play and save scores
- Perfect for classroom demos!


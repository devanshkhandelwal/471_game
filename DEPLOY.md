# Quick Deployment Guide

## Easiest Option: Render.com (5 minutes)

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to [render.com](https://render.com) and sign up (free)
   - Click "New +" → "Web Service"
   - Connect your GitHub account and select your repository
   - Settings:
     - **Name**: ab-effort-game
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Your app is live! Share the URL with your class

## Alternative: Railway.app (Even Easier)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Done! Railway auto-detects everything

## For Local Network (No Internet Required)

If you want to run it on your local network for class:

1. Start server: `npm start`
2. Find your IP address:
   - Mac: Run `ipconfig getifaddr en0` in terminal
   - Windows: Run `ipconfig` and look for "IPv4 Address"
3. Share: `http://YOUR_IP:3000` (e.g., `http://192.168.1.100:3000`)
4. Make sure all devices are on the same WiFi network

## Testing Locally First

```bash
npm install
npm start
```

Then open http://localhost:3000

## What Changed?

- ✅ Backend API server (`server.js`)
- ✅ Leaderboard stored in `leaderboard.json` file
- ✅ Frontend now fetches/saves scores from API
- ✅ Leaderboard auto-refreshes every 5 seconds
- ✅ All players see the same shared leaderboard

## Notes

- The `leaderboard.json` file is created automatically
- All scores are shared across all players
- No database needed - just a simple JSON file!
- Perfect for classroom demos


# Connector Scoring API - SQLite Backend

Node.js + Express + SQLite backend for shared connector scoring.

## Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Run locally
```bash
npm start
```

The server will run on `http://localhost:5002`

### 3. Test the API
```bash
# Get all scores
curl http://localhost:5002/api/scores

# Save scores
curl -X POST http://localhost:5002/api/scores \
  -H "Content-Type: application/json" \
  -d '[{"name":"Salesforce","adoption":5},...]'

# Health check
curl http://localhost:5002/health
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scores` | Get all connector scores |
| POST | `/api/scores` | Save all connector scores |
| GET | `/api/scores/:id` | Get single connector score |
| PUT | `/api/scores/:id` | Update single connector score |
| GET | `/health` | Health check |

## Database

SQLite database file: `scores.db`

### Schema
```sql
CREATE TABLE connector_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  connector_id INTEGER NOT NULL UNIQUE,
  connector_name TEXT NOT NULL,
  adoption INTEGER DEFAULT 0,
  alignment INTEGER DEFAULT 0,
  demand INTEGER DEFAULT 0,
  effort INTEGER DEFAULT 0,
  impact INTEGER DEFAULT 0,
  collapsed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Deployment

### Option 1: Railway.app (Recommended - Free)
1. Push code to GitHub
2. Go to railway.app
3. Connect GitHub repo
4. Deploy

### Option 2: Heroku (Paid)
1. `heroku create`
2. `git push heroku main`

### Option 3: Your own server
1. Install Node.js
2. Clone repo
3. `npm install && npm start`

## Environment Variables

Create `.env` file:
```
PORT=5002
```

## Development

With nodemon (auto-restart on changes):
```bash
npm run dev
```

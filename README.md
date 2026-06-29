# Nintex Connector Prioritizer

## Setup & Running

### Prerequisites
- Python 3.7+
- Flask

### Installation

1. Install Flask:
```bash
pip install flask
```

2. Navigate to the project directory:
```bash
cd /Users/osamaeldrieny/Sandbox/Nintex\ Connector\ Priotrizer
```

### Running the Server

```bash
python app.py
```

The server will start at `http://localhost:5000`

### How It Works

1. **Load Connectors**: Opens http://localhost:5000 to load all connectors from `connectors.json`
2. **Score Connectors**: Click on score buttons (1-5) to rate each connector
3. **Auto-Save**: Scores are automatically saved to `connectors.json` when you update them
4. **View Rankings**: The priority ranking table updates automatically based on scores
5. **Collapse/Expand**: Click on connector names to collapse/expand scoring details

### API Endpoints

- `GET /api/connectors` - Retrieve all connectors
- `POST /api/connectors` - Save all connectors
- `PUT /api/connectors/<id>` - Update a specific connector

### Notes

- All scores start at 3 (default/neutral)
- Changes are persisted to `connectors.json`
- No localStorage dependency
- Add Connector feature is hidden

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'scores.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database:', dbPath);
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS connector_scores (
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
    `);
  });
}

// GET all connector scores
app.get('/api/scores', (req, res) => {
  db.all('SELECT * FROM connector_scores ORDER BY connector_name', (err, rows) => {
    if (err) {
      console.error('Error fetching scores:', err);
      return res.status(500).json({ error: 'Error fetching scores' });
    }
    res.json(rows || []);
  });
});

// POST save connector scores
app.post('/api/scores', (req, res) => {
  const connectors = req.body;

  if (!Array.isArray(connectors)) {
    return res.status(400).json({ error: 'Expected array of connectors' });
  }

  // Clear existing scores and insert new ones
  db.serialize(() => {
    db.run('DELETE FROM connector_scores', (err) => {
      if (err) {
        console.error('Error clearing scores:', err);
        return res.status(500).json({ error: 'Error saving scores' });
      }

      // Insert all scores
      const stmt = db.prepare(`
        INSERT INTO connector_scores
        (connector_id, connector_name, adoption, alignment, demand, effort, impact, collapsed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let inserted = 0;
      connectors.forEach((connector, index) => {
        stmt.run(
          index,
          connector.name,
          connector.adoption || 0,
          connector.alignment || 0,
          connector.demand || 0,
          connector.effort || 0,
          connector.impact || 0,
          connector.collapsed ? 1 : 0,
          (err) => {
            if (err) console.error('Error inserting score:', err);
            inserted++;

            // Send response after all inserts
            if (inserted === connectors.length) {
              stmt.finalize();
              res.json({
                success: true,
                message: 'Scores saved successfully',
                count: connectors.length
              });
            }
          }
        );
      });
    });
  });
});

// GET single connector score
app.get('/api/scores/:id', (req, res) => {
  db.get(
    'SELECT * FROM connector_scores WHERE connector_id = ?',
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching score' });
      }
      res.json(row || {});
    }
  );
});

// PUT update single connector score
app.put('/api/scores/:id', (req, res) => {
  const { adoption, alignment, demand, effort, impact, collapsed } = req.body;

  db.run(
    `UPDATE connector_scores
     SET adoption = ?, alignment = ?, demand = ?, effort = ?, impact = ?, collapsed = ?, updated_at = CURRENT_TIMESTAMP
     WHERE connector_id = ?`,
    [adoption || 0, alignment || 0, demand || 0, effort || 0, impact || 0, collapsed ? 1 : 0, req.params.id],
    (err) => {
      if (err) {
        console.error('Error updating score:', err);
        return res.status(500).json({ error: 'Error updating score' });
      }
      res.json({ success: true, message: 'Score updated' });
    }
  );
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Connector Scoring API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Connector Scoring API running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${dbPath}`);
  console.log(`📝 POST /api/scores - Save all connector scores`);
  console.log(`📖 GET /api/scores - Get all connector scores`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error('Error closing database:', err);
    console.log('Database connection closed');
    process.exit(0);
  });
});

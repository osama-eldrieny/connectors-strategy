const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Read scores from the scores.json file
    const scoresPath = path.join(__dirname, '../../scores.json');

    if (!fs.existsSync(scoresPath)) {
      // If scores file doesn't exist yet, return empty
      return {
        statusCode: 200,
        body: JSON.stringify([])
      };
    }

    const scores = fs.readFileSync(scoresPath, 'utf8');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: scores
    };
  } catch (error) {
    console.error('Error loading scores:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error loading scores' })
    };
  }
};

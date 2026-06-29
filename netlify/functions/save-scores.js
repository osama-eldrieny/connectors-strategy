const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const scores = JSON.parse(event.body);

    // Save to local scores.json file
    const scoresPath = path.join(__dirname, '../../scores.json');
    fs.writeFileSync(scoresPath, JSON.stringify(scores, null, 2));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Scores saved successfully',
        count: scores.length
      })
    };
  } catch (error) {
    console.error('Error saving scores:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error saving scores: ' + error.message })
    };
  }
};

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const scores = JSON.parse(event.body);

    // For now, just acknowledge the save request
    // Scores are persisted in browser localStorage
    console.log('Received scores update:', scores.length, 'connectors');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Scores acknowledged',
        count: scores.length
      })
    };
  } catch (error) {
    console.error('Error processing scores:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error processing scores: ' + error.message })
    };
  }
};

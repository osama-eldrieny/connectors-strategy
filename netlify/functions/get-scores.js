exports.handler = async (event, context) => {
  try {
    // For now, return empty scores to avoid errors
    // Scores will be stored in localStorage on the client
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([])
    };
  } catch (error) {
    console.error('Error loading scores:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error loading scores' })
    };
  }
};

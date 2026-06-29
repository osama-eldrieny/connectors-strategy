exports.handler = async (event, context) => {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const repo = 'Osama-Eldrieny_nintex/connectors-strategy';
    const filePath = 'scores.json';

    // Fetch scores from GitHub repo
    const response = await fetch(
      `https://raw.githubusercontent.com/${repo}/main/${filePath}`,
      {
        headers: githubToken ? { 'Authorization': `token ${githubToken}` } : {}
      }
    );

    if (!response.ok) {
      // If file doesn't exist yet, return empty array
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([])
      };
    }

    const scoresData = await response.text();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: scoresData
    };
  } catch (error) {
    console.error('Error loading scores:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error loading scores: ' + error.message })
    };
  }
};

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const repo = 'Osama-Eldrieny_nintex/connectors-strategy';
    const filePath = 'scores.json';

    // Use GitHub API to fetch (bypasses CDN cache, always gets latest)
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!response.ok) {
      // If file doesn't exist yet, return empty array
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify([])
      };
    }

    const fileData = await response.json();
    const scoresData = Buffer.from(fileData.content, 'base64').toString('utf-8');

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: scoresData
    };
  } catch (error) {
    console.error('Error loading scores:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Error loading scores: ' + error.message })
    };
  }
};

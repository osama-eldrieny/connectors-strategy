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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const scores = JSON.parse(event.body);
    const githubToken = process.env.GITHUB_TOKEN;
    const repo = 'Osama-Eldrieny_nintex/connectors-strategy';
    const filePath = 'scores.json';

    if (!githubToken) {
      console.warn('GITHUB_TOKEN not set, scores not persisted');
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'Scores saved locally (not persisted to GitHub)',
          count: scores.length
        })
      };
    }

    // Get current file SHA for update
    let sha = null;
    try {
      const getResponse = await fetch(
        `https://api.github.com/repos/${repo}/contents/${filePath}`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (getResponse.ok) {
        const fileData = await getResponse.json();
        sha = fileData.sha;
      }
    } catch (e) {
      console.log('File does not exist yet, will create new file');
    }

    // Update or create file with new scores
    const updateResponse = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Update connector scores - ${new Date().toLocaleString()}`,
          content: Buffer.from(JSON.stringify(scores, null, 2)).toString('base64'),
          ...(sha && { sha: sha })
        })
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('GitHub API response:', errorData);
      throw new Error(`GitHub API error (${updateResponse.status}): ${errorData.message || 'Unknown error'}`);
    }

    console.log('Scores saved to GitHub:', scores.length, 'connectors');

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Scores saved to GitHub successfully',
        count: scores.length
      })
    };
  } catch (error) {
    console.error('Error saving scores:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Error saving scores: ' + error.message,
        hint: 'Make sure GITHUB_TOKEN is set in Netlify environment variables'
      })
    };
  }
};

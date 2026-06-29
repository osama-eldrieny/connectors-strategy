exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Scores saved locally (not persisted to GitHub)',
          count: scores.length
        })
      };
    }

    // Get current file SHA for update
    const getResponse = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    let sha = null;
    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
    }

    // Update file with new scores
    const updateResponse = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update connector scores - ${new Date().toLocaleString()}`,
          content: Buffer.from(JSON.stringify(scores, null, 2)).toString('base64'),
          sha: sha
        })
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      throw new Error(`GitHub API error: ${error.message}`);
    }

    console.log('Scores saved to GitHub:', scores.length, 'connectors');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
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
      body: JSON.stringify({
        error: 'Error saving scores: ' + error.message,
        hint: 'Make sure GITHUB_TOKEN is set in Netlify environment variables'
      })
    };
  }
};

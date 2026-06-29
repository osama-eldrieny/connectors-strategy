exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const answers = JSON.parse(event.body);
    const githubToken = process.env.GITHUB_TOKEN;
    const repo = 'Osama-Eldrieny_nintex/connectors-strategy';
    const filePath = 'filtering-answers.json';

    if (!githubToken) {
      console.warn('GITHUB_TOKEN not set, answers not persisted');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Answers saved locally (not persisted to GitHub)',
          count: Object.keys(answers).length
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

    // Update or create file with new answers
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
          message: `Update filtering answers - ${new Date().toLocaleString()}`,
          content: Buffer.from(JSON.stringify(answers, null, 2)).toString('base64'),
          ...(sha && { sha: sha })
        })
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('GitHub API response:', errorData);
      throw new Error(`GitHub API error (${updateResponse.status}): ${errorData.message || 'Unknown error'}`);
    }

    console.log('Filtering answers saved to GitHub');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Answers saved to GitHub successfully',
        count: Object.keys(answers).length
      })
    };
  } catch (error) {
    console.error('Error saving answers:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error saving answers: ' + error.message,
        hint: 'Make sure GITHUB_TOKEN is set in Netlify environment variables'
      })
    };
  }
};

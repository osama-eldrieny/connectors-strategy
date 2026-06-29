exports.handler = async (event, context) => {
  const token = process.env.GITHUB_TOKEN;
  const repo = 'Osama-Eldrieny_nintex/connectors-strategy';

  try {
    // Test if token works by fetching user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `token ${token}` }
    });
    const userData = await userResponse.json();

    // Test if repo is accessible
    const repoResponse = await fetch(
      `https://api.github.com/repos/${repo}`,
      { headers: { 'Authorization': `token ${token}` } }
    );
    const repoData = await repoResponse.json();

    // List user's repos
    const reposResponse = await fetch(
      'https://api.github.com/user/repos?per_page=100',
      { headers: { 'Authorization': `token ${token}` } }
    );
    const reposData = await reposResponse.json();
    const repoNames = reposData.map(r => r.full_name);

    return {
      statusCode: 200,
      body: JSON.stringify({
        tokenValid: userResponse.ok,
        tokenUser: userData.login,
        repoAccessible: repoResponse.ok,
        repoStatus: repoResponse.status,
        repoError: repoData.message,
        repoPath: repo,
        availableRepos: repoNames
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

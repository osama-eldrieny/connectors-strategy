const fs = require('fs');
const path = require('path');

const REVIEWS_FILE = path.join(__dirname, '../../reviews.json');

const loadReviews = () => {
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      const data = fs.readFileSync(REVIEWS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading reviews:', error);
  }
  return {
    waseem: { comment: '', approved: false },
    josh: { comment: '', approved: false },
    john: { comment: '', approved: false }
  };
};

const saveReviews = (data) => {
  try {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving reviews:', error);
    return false;
  }
};

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // GET request - fetch reviews
  if (event.httpMethod === 'GET') {
    try {
      const reviews = loadReviews();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(reviews)
      };
    } catch (error) {
      console.error('Error loading reviews:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Error loading reviews: ' + error.message })
      };
    }
  }

  // POST request - save reviews
  if (event.httpMethod === 'POST') {
    try {
      const reviews = JSON.parse(event.body);
      const success = saveReviews(reviews);

      if (!success) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to save reviews' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'saved',
          data: reviews
        })
      };
    } catch (error) {
      console.error('Error saving reviews:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Error saving reviews: ' + error.message })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};

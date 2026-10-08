let inMemoryState = null;

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
    try {
      const data = JSON.parse(event.body);
      if (Array.isArray(data)) {
        inMemoryState = data;
      } else if (data && data.fleet && Array.isArray(data.fleet)) {
        inMemoryState = data.fleet;
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, count: inMemoryState ? inMemoryState.length : 0, updatedAt: new Date().toISOString() })
      };
    } catch (err) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: err.message })
      };
    }
  }

  // GET
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(inMemoryState || [])
  };
};

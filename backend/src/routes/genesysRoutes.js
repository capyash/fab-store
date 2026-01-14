/**
 * Genesys Cloud API Proxy Routes
 * 
 * Proxies OAuth and API requests to Genesys Cloud to avoid CORS issues
 * Author: Vinod Kumar V (VKV)
 */

import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

/**
 * POST /api/v1/genesys/oauth/token
 * Get OAuth access token using client credentials
 */
router.post('/oauth/token', async (req, res) => {
  try {
    const { clientId, clientSecret, oauthEndpoint } = req.body;

    if (!clientId || !clientSecret) {
      return res.status(400).json({
        error: 'Client ID and Client Secret are required',
      });
    }

    const endpoint = oauthEndpoint || 'https://login.usw2.pure.cloud/oauth/token';
    
    // Create Basic Auth header
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    // Create form data for OAuth request
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `OAuth failed: ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Genesys OAuth proxy error:', error);
    res.status(500).json({
      error: 'Failed to get OAuth token',
      message: error.message,
    });
  }
});

/**
 * Proxy handler for API requests
 * Extracts path from req.url after /api/
 */
const handleApiProxy = async (req, res) => {
  try {
    const method = req.method;
    // Get path from req.apiPath (set by middleware) or extract from req.url
    const apiPath = req.apiPath || (req.url.startsWith('/') ? req.url.substring(1) : req.url);
    
    // Get accessToken and apiEndpoint from query (GET) or body (POST/PATCH)
    const accessToken = req.query.accessToken || (req.body && req.body.accessToken);
    const apiEndpoint = req.query.apiEndpoint || (req.body && req.body.apiEndpoint);

    if (!accessToken) {
      return res.status(400).json({
        error: 'Access token is required',
      });
    }

    const endpoint = apiEndpoint || 'https://api.usw2.pure.cloud';
    // apiPath will be like 'v2/conversations' or 'api/v2/conversations' after backend strips '/api/' prefix
    // If apiPath already starts with 'api/', use it as-is, otherwise add '/api/' prefix
    // This handles both cases: 'v2/conversations' -> 'api/v2/conversations' and 'api/v2/conversations' -> 'api/v2/conversations'
    let normalizedPath = apiPath;
    if (!normalizedPath.startsWith('api/')) {
      normalizedPath = `api/${normalizedPath}`;
    }
    const url = `${endpoint}/${normalizedPath}`;
    
    // Prepare body for POST/PATCH requests
    let body = null;
    if (method !== 'GET') {
      const requestBody = req.body || {};
      const { accessToken: _, apiEndpoint: __, ...cleanBody } = requestBody;
      body = Object.keys(cleanBody).length > 0 ? JSON.stringify(cleanBody) : null;
    }
    
    const fetchOptions = {
      method: method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      fetchOptions.body = body;
    }
    
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `API request failed: ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Genesys API proxy error:', error);
    res.status(500).json({
      error: 'Failed to proxy API request',
      message: error.message,
    });
  }
};

// Handle all API proxy routes using middleware
// Extract path from req.url after removing /api/ prefix
router.use('/api', (req, res, next) => {
  // Extract the remaining path after /api/
  // req.url will be like '/v2/conversations' or '/api/v2/conversations' when request is /api/v2/conversations or /api/api/v2/conversations
  let extractedPath = req.url.startsWith('/') ? req.url.substring(1) : req.url;
  
  // If path still starts with 'api/', remove it (handles case where frontend sends /api/api/v2/...)
  if (extractedPath.startsWith('api/')) {
    extractedPath = extractedPath.substring(4); // Remove 'api/'
  }
  
  req.apiPath = extractedPath;
  handleApiProxy(req, res);
});

export default router;

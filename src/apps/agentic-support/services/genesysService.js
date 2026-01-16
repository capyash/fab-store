/**
 * Genesys Cloud API Integration Service
 * Integration with Genesys PureCloud API for CCAS functionality
 * Author: Vinod Kumar V (VKV)
 */

import { getCCASConfig } from './ccasService';

const TOKEN_STORAGE_KEY = 'agenticSupport.genesys.accessToken';
const TOKEN_EXPIRY_KEY = 'agenticSupport.genesys.tokenExpiry';

/**
 * Get Genesys configuration
 * @returns {Object} Genesys configuration
 */
function getGenesysConfig() {
  const config = getCCASConfig();
  return config.genesys || {};
}

/**
 * Get stored access token
 * @returns {Object|null} { token, expiresAt } or null
 */
function getStoredToken() {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (token && expiry) {
      const expiresAt = new Date(expiry);
      if (expiresAt > new Date()) {
        return { token, expiresAt };
      }
    }
  } catch (error) {
    console.error('Error reading stored token:', error);
  }
  return null;
}

/**
 * Store access token
 * @param {string} token - Access token
 * @param {Date} expiresAt - Token expiration date
 */
function storeToken(token, expiresAt) {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toISOString());
  } catch (error) {
    console.error('Error storing token:', error);
  }
}

/**
 * Clear stored token
 */
function clearToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error('Error clearing token:', error);
  }
}

/**
 * Get backend proxy URL
 * @returns {string} Backend proxy URL or null if not available
 */
function getBackendProxyUrl() {
  return import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3001';
}

/**
 * Get OAuth access token using client credentials flow
 * Uses backend proxy to avoid CORS issues
 * @returns {Promise<string>} Access token
 */
async function getAccessToken() {
  // Check if we have a valid stored token
  const stored = getStoredToken();
  if (stored) {
    return stored.token;
  }

  const config = getGenesysConfig();
  
  if (!config.clientId || !config.clientSecret) {
    throw new Error('Genesys Client ID and Client Secret are required. Please configure in Admin panel.');
  }

  const oauthEndpoint = config.oauthEndpoint || 'https://login.usw2.pure.cloud/oauth/token';
  const backendProxyUrl = getBackendProxyUrl();
  
  try {
    // Use backend proxy to avoid CORS issues
    const response = await fetch(`${backendProxyUrl}/api/v1/genesys/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        oauthEndpoint: oauthEndpoint,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`OAuth failed: ${response.status} - ${errorData.error || errorData.details || 'Unknown error'}`);
    }

    const data = await response.json();
    const expiresAt = new Date(Date.now() + (data.expires_in * 1000) - 60000); // Refresh 1 min before expiry
    
    storeToken(data.access_token, expiresAt);
    
    return data.access_token;
  } catch (error) {
    console.error('Genesys OAuth error:', error);
    clearToken();
    
    // Provide helpful error messages for C-level demo
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error(
        `Backend connection error. Please ensure the backend server is running on ${backendProxyUrl}`
      );
    }
    
    // Handle specific OAuth errors
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      throw new Error('Invalid Genesys credentials. Please check Client ID and Client Secret in Admin → CCAS Configuration.');
    }
    
    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      throw new Error('Genesys API access denied. Please verify your organization permissions.');
    }
    
    // Generic error with helpful message
    const errorMsg = error.message || 'Unknown error';
    throw new Error(`Genesys authentication failed: ${errorMsg}`);
  }
}

/**
 * Make authenticated API request to Genesys
 * Uses backend proxy to avoid CORS issues
 * @param {string} endpoint - API endpoint (relative to base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} API response
 */
async function genesysApiRequest(endpoint, options = {}) {
  const config = getGenesysConfig();
  const apiBase = config.apiEndpoint || 'https://api.usw2.pure.cloud';
  const token = await getAccessToken();
  const backendProxyUrl = getBackendProxyUrl();
  
  // Normalize endpoint: remove leading slash
  // Backend route /api/v1/genesys/api/* matches /api/* and extracts path after /api/
  // So if we send /api/v2/conversations, backend gets 'v2/conversations' and constructs:
  // ${endpoint}/api/v2/conversations (backend now correctly adds /api/ prefix)
  let apiPath = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  
  try {
    // Use backend proxy for GET requests
    if (!options.method || options.method === 'GET') {
      const queryParams = new URLSearchParams({
        accessToken: token,
        apiEndpoint: apiBase,
      });

        let urlParts = `${backendProxyUrl}/api/v1/genesys/api/${apiPath}?${queryParams}`.split('?');
        let finalUrl = "";
        switch(urlParts.length){
          case 1:
          case 2:
            finalUrl= urlParts.join("?")
            break;
          default:
            finalUrl = urlParts[0] + "?" + urlParts.slice(1).join("&");
        }

        // console.log(urlParts);
        // urlParts.searchParams.forEach((key, value) => console.log(key, value));
    
        const response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        clearToken();
        const newToken = await getAccessToken();
        const retryQueryParams = new URLSearchParams({
          accessToken: newToken,
          apiEndpoint: apiBase,
        });
        return fetch(`${backendProxyUrl}/api/v1/genesys/api/${apiPath}?${retryQueryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      return response;
    }
    
    // Use backend proxy for POST/PATCH requests
    const method = options.method || 'POST';
    const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};
    
    const response = await fetch(`${backendProxyUrl}/api/v1/genesys/api/${apiPath}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        accessToken: token,
        apiEndpoint: apiBase,
      }),
    });

    if (response.status === 401) {
      clearToken();
      const newToken = await getAccessToken();
      return fetch(`${backendProxyUrl}/api/v1/genesys/api/${apiPath}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...body,
          accessToken: newToken,
          apiEndpoint: apiBase,
        }),
      });
    }

    return response;
  } catch (error) {
    console.error('Genesys API proxy error:', error);
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error(
        `Backend connection error. Please ensure the backend server is running on ${backendProxyUrl}`
      );
    }
    
    // Handle 401 - token expired
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      clearToken();
      throw new Error('Session expired. Please refresh the page to reconnect.');
    }
    
    throw error;
  }
}

/**
 * Connect to Genesys Cloud
 * @returns {Promise<Object>} Connection status
 */
export async function connect() {
  try {
    const token = await getAccessToken();
    const config = getGenesysConfig();
    
    // Verify connection by checking permissions
    const response = await genesysApiRequest('/api/v2/authorization/permissions');
    
    if (!response.ok) {
      throw new Error(`Connection failed: ${response.status}`);
    }

    return {
      connected: true,
      accessToken: token,
      expiresAt: getStoredToken()?.expiresAt || new Date(Date.now() + 3600000),
      orgName: config.orgName || 'tp-ctss42',
      region: config.region || 'usw2',
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      orgName: getGenesysConfig().orgName || 'tp-ctss42',
      region: getGenesysConfig().region || 'usw2',
    };
  }
}

/**
 * Get Genesys connection status
 * @returns {Promise<Object>} Connection status
 */
export async function getConnectionStatus() {
  try {
    const connection = await connect();
    return {
      status: connection.connected ? 'connected' : 'disconnected',
      orgName: connection.orgName,
      region: connection.region,
      timestamp: new Date(),
      error: connection.error,
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date(),
    };
  }
}

/**
 * Get Genesys conversations
 * @param {Object} options - Query options { state, pageSize, pageNumber }
 * @returns {Promise<Object>} Conversations data
 */
export async function getConversations(options = {}) {
  try {
    const { state = 'active', pageSize = 25, pageNumber = 1 } = options;
    const params = new URLSearchParams({
      state,
      pageSize: pageSize.toString(),
      pageNumber: pageNumber.toString(),
    });

    // url = new URL(`/api/v2/conversations`);
    // let searchParams = url.searchParams;
    // searchParams.append(params);

    const response = await genesysApiRequest(`/api/v2/conversations?${params}`);
    
    let apiData;
    if (response.ok) {
      apiData = await response.json();
    } else {
      throw new Error(`Failed to fetch conversations: ${response.status}`);
    }

    // Merge with demo conversations from localStorage
    const demoConversations = JSON.parse(localStorage.getItem('genesys_demo_conversations') || '[]');
    const activeDemoConversations = demoConversations.filter(c => c.state === state);
    
    // Combine API conversations with demo conversations
    const allEntities = [
      ...(apiData.entities || []),
      ...activeDemoConversations,
    ];

    return {
      entities: allEntities,
      pageSize: apiData.pageSize || options.pageSize || 25,
      pageNumber: apiData.pageNumber || options.pageNumber || 1,
      total: (apiData.total || 0) + activeDemoConversations.length,
    };
  } catch (error) {
    console.error('Error fetching conversations:', error);
    // Return demo conversations if API fails
    const demoConversations = JSON.parse(localStorage.getItem('genesys_demo_conversations') || '[]');
    const activeDemoConversations = demoConversations.filter(c => c.state === (options.state || 'active'));
    
    return {
      entities: activeDemoConversations,
      pageSize: options.pageSize || 25,
      pageNumber: options.pageNumber || 1,
      total: activeDemoConversations.length,
      error: error.message,
    };
  }
}

/**
 * Get conversation details
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Object>} Conversation details
 */
export async function getConversationDetails(conversationId) {
  try {
    const response = await genesysApiRequest(`/api/v2/conversations/${conversationId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching conversation details:', error);
    throw error;
  }
}

/**
 * Get conversation messages/transcript
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Array>} Messages
 */
export async function getConversationMessages(conversationId) {
  try {
    const response = await genesysApiRequest(`/api/v2/conversations/${conversationId}/messages`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

/**
 * Get conversation participants
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Array>} Participants
 */
export async function getConversationParticipants(conversationId) {
  try {
    const response = await genesysApiRequest(`/api/v2/conversations/${conversationId}/participants`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch participants: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching participants:', error);
    return [];
  }
}

/**
 * Get Genesys real-time stats
 * @returns {Promise<Object>} Statistics
 */
export async function getStats() {
  try {
    const config = getGenesysConfig();
    
    // Get active conversations count
    const conversationsResponse = await getConversations({ state: 'active', pageSize: 1 });
    const activeCount = conversationsResponse.total || 0;

    // Get queue stats (if queue ID is available)
    // For now, return basic stats
    return {
      activeCalls: activeCount,
      queuedMessages: 0, // Would need queue ID to get this
      throughput: Math.floor(Math.random() * 50) + 150, // Would need analytics API
      latency: Math.floor(Math.random() * 10) + 8,
      orgName: config.orgName || 'tp-ctss42',
      region: config.region || 'usw2',
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return mock data if API fails
    const config = getGenesysConfig();
    return {
      activeCalls: Math.floor(Math.random() * 10),
      queuedMessages: Math.floor(Math.random() * 5),
      throughput: Math.floor(Math.random() * 50) + 150,
      latency: Math.floor(Math.random() * 10) + 8,
      orgName: config.orgName || 'tp-ctss42',
      region: config.region || 'usw2',
      error: error.message,
    };
  }
}

/**
 * Get Genesys channel status
 * @returns {Promise<Array>} Channel statuses
 */
export async function getChannels() {
  try {
    // Get conversations by type to determine channel status
    const [calls, chats, emails] = await Promise.all([
      getConversations({ state: 'active' }).catch(() => ({ entities: [] })),
      getConversations({ state: 'active' }).catch(() => ({ entities: [] })),
      getConversations({ state: 'active' }).catch(() => ({ entities: [] })),
    ]);

    // Determine channel status based on active conversations
    // This is simplified - in production, you'd filter by conversation type
    const hasActive = (calls.entities?.length > 0) || (chats.entities?.length > 0) || (emails.entities?.length > 0);

    return [
      {
        id: 'voice',
        name: 'Voice (Genesys)',
        status: hasActive ? 'active' : 'inactive',
        type: 'voice',
      },
      {
        id: 'sms',
        name: 'SMS/WhatsApp',
        status: hasActive ? 'active' : 'inactive',
        type: 'messaging',
      },
      {
        id: 'email',
        name: 'Email/Chat',
        status: hasActive ? 'active' : 'inactive',
        type: 'email',
      },
    ];
  } catch (error) {
    console.error('Error fetching channels:', error);
    // Return default active status
    return [
      {
        id: 'voice',
        name: 'Voice (Genesys)',
        status: 'active',
        type: 'voice',
      },
      {
        id: 'sms',
        name: 'SMS/WhatsApp',
        status: 'active',
        type: 'messaging',
      },
      {
        id: 'email',
        name: 'Email/Chat',
        status: 'active',
        type: 'email',
      },
    ];
  }
}

/**
 * Initialize Genesys webhooks
 * @param {Object} webhookConfig - Webhook configuration
 * @returns {Promise<Object>} Webhook status
 */
export async function initializeWebhooks(webhookConfig) {
  try {
    // Create notification channel
    const channelResponse = await genesysApiRequest('/api/v2/notifications/channels', {
      method: 'POST',
    });

    if (!channelResponse.ok) {
      throw new Error(`Failed to create notification channel: ${channelResponse.status}`);
    }

    const channel = await channelResponse.json();

    // Subscribe to conversation events
    const subscriptionResponse = await genesysApiRequest('/api/v2/notifications/subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        channelId: channel.id,
        topic: 'v2.conversations',
      }),
    });

    if (!subscriptionResponse.ok) {
      throw new Error(`Failed to create subscription: ${subscriptionResponse.status}`);
    }

    return {
      registered: true,
      channelId: channel.id,
      webhooks: webhookConfig,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error initializing webhooks:', error);
    return {
      registered: false,
      error: error.message,
      timestamp: new Date(),
    };
  }
}

/**
 * Send message via Genesys
 * @param {string} conversationId - Conversation ID
 * @param {Object} messageData - Message data
 * @returns {Promise<Object>} Message result
 */
export async function sendMessage(conversationId, messageData) {
  try {
    const response = await genesysApiRequest(`/api/v2/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      messageId: result.id,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date(),
    };
  }
}

/**
 * Update conversation with resolution
 * @param {string} conversationId - Conversation ID
 * @param {Object} updateData - Update data (notes, wrapup, etc.)
 * @returns {Promise<Object>} Update result
 */
export async function updateConversation(conversationId, updateData) {
  try {
    const response = await genesysApiRequest(`/api/v2/conversations/${conversationId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update conversation: ${response.status}`);
    }

    return {
      success: true,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error updating conversation:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date(),
    };
  }
}

/**
 * HP Demo Scenarios - Variety of realistic HP printer and laptop issues
 */
const HP_DEMO_SCENARIOS = [
  // Printer Issues
  {
    transcript: 'Hi, my HP LaserJet printer on floor 3 is offline and nothing is printing. The status light is blinking red.',
    workflow: 'printer_offline',
    device: 'printer'
  },
  {
    transcript: 'My HP OfficeJet printer keeps saying the cyan ink cartridge is not recognized even though I just installed a genuine HP cartridge.',
    workflow: 'ink_error',
    device: 'printer'
  },
  {
    transcript: 'My HP LaserJet printer has a paper jam. I tried clearing it but the error message keeps coming back every time I try to print.',
    workflow: 'paper_jam',
    device: 'printer'
  },
  {
    transcript: 'The HP printer in our office is printing everything with streaks and smudges. We just replaced the toner but the quality is still terrible.',
    workflow: 'print_quality',
    device: 'printer'
  },
  {
    transcript: 'The HP printer is printing very slowly. It takes almost 5 minutes to print a single page and the queue keeps backing up.',
    workflow: 'slow_print',
    device: 'printer'
  },
  {
    transcript: 'The HP printer is showing low toner warning but we just replaced it last week. The print quality is also getting worse.',
    workflow: 'ink_error',
    device: 'printer'
  },
  {
    transcript: 'Our HP LaserJet printer on the 5th floor cannot connect to the network. The network status shows disconnected and we cannot print wirelessly.',
    workflow: 'network_issue',
    device: 'printer'
  },
  // Laptop Issues
  {
    transcript: 'I have an HP EliteBook laptop and the screen is flickering constantly. It started this morning and now I can barely see anything.',
    workflow: 'display_issue',
    device: 'laptop'
  },
  {
    transcript: 'My HP Spectre laptop is running extremely slow. It takes forever to open applications and the fan is running constantly.',
    workflow: 'slow_performance',
    device: 'laptop'
  },
  {
    transcript: 'My HP ProBook laptop battery is draining very fast. It used to last 8 hours but now it only lasts about 2 hours even when fully charged.',
    workflow: 'battery_drain',
    device: 'laptop'
  },
  {
    transcript: 'My HP ZBook laptop is overheating. It gets very hot after just 10 minutes of use and shuts down automatically.',
    workflow: 'overheating',
    device: 'laptop'
  },
  {
    transcript: 'My HP Envy laptop keyboard is not working properly. Several keys are stuck or not responding, especially the spacebar and enter key.',
    workflow: 'keyboard_issue',
    device: 'laptop'
  },
  {
    transcript: 'My HP EliteBook laptop cannot connect to the Wi-Fi network. It shows connected but there is no internet access and I cannot access any websites.',
    workflow: 'network_issue',
    device: 'laptop'
  },
  {
    transcript: 'My HP ProBook laptop screen is completely black. The power light is on but nothing displays on the screen, even after restarting.',
    workflow: 'display_issue',
    device: 'laptop'
  },
  {
    transcript: 'My HP Spectre laptop is freezing randomly. Applications stop responding and I have to force restart the laptop multiple times a day.',
    workflow: 'slow_performance',
    device: 'laptop'
  }
];

/**
 * Create a test conversation for demo purposes
 * This simulates a mobile call coming into Genesys
 * @param {Object} callData - Call data { phoneNumber, customerName, transcript, workflow }
 * @returns {Promise<Object>} Created conversation
 */
export async function createTestConversation(callData) {
  try {
    // If no transcript provided, randomly select from HP scenarios
    let selectedScenario;
    if (callData.transcript) {
      selectedScenario = {
        transcript: callData.transcript,
        workflow: callData.workflow || 'printer_offline',
        device: callData.device || 'printer'
      };
    } else {
      selectedScenario = HP_DEMO_SCENARIOS[Math.floor(Math.random() * HP_DEMO_SCENARIOS.length)];
    }
    
    // For demo: Create a mock conversation that will appear in the list
    // In production, this would create an actual Genesys conversation via API
    const testConversation = {
      id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      mediaType: 'call',
      state: 'active',
      direction: 'inbound',
      participants: [
        {
          id: `participant-${Date.now()}`,
          name: callData.customerName || (() => {
            const names = ['Sarah Mitchell', 'David Chen', 'Michael Rodriguez', 'Emily Johnson', 'James Wilson', 'Lisa Anderson', 'Robert Taylor', 'Jennifer Martinez', 'Christopher Lee', 'Amanda White'];
            return names[Math.floor(Math.random() * names.length)];
          })(),
          address: callData.phoneNumber || `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
          purpose: 'customer',
        },
      ],
      startTime: new Date().toISOString(),
      conversationId: `conv-${Date.now()}`,
      // Store transcript in localStorage for demo purposes
      _demoTranscript: selectedScenario.transcript,
      _demoWorkflow: selectedScenario.workflow,
      _demoDevice: selectedScenario.device,
    };

    // Store in localStorage for demo - will be picked up by getConversations
    const stored = JSON.parse(localStorage.getItem('genesys_demo_conversations') || '[]');
    stored.push(testConversation);
    localStorage.setItem('genesys_demo_conversations', JSON.stringify(stored));

    return {
      success: true,
      conversation: testConversation,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error creating test conversation:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date(),
    };
  }
}

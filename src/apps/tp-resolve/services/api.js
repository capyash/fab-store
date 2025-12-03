/**
 * API Service Layer for TP Resolve
 * 
 * This service provides a clean interface for all API calls.
 * Supports demo mode (frontend-only) and backend mode (API calls with SSE streaming).
 */

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

// Helper to get demo mode state
const getDemoMode = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const urlDemo = urlParams.get('demo');
    if (urlDemo !== null) {
      return urlDemo === 'true' || urlDemo === '1';
    }
    const stored = localStorage.getItem('cogniclaim.demoMode');
    if (stored !== null) {
      return stored === 'true';
    }
  }
  return true;
};

// Helper to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Cases API
 */
export const casesAPI = {
  /**
   * Fetch all cases with optional filters
   * @param {Object} filters - { status, type, jurisdiction, search, page, pageSize }
   * @returns {Promise<{ cases: Array, total: number }>}
   */
  async getAll(filters = {}) {
    const isDemoMode = getDemoMode();
    
    try {
      if (isDemoMode) {
        await delay(400);
        const { ALL_CASES } = await import('../data/cases');
        let filtered = [...ALL_CASES];
        
        if (filters.status && filters.status !== 'All') {
          filtered = filtered.filter(c => c.status === filters.status);
        }
        
        if (filters.type && filters.type !== 'All') {
          filtered = filtered.filter(c => c.type === filters.type);
        }
        
        if (filters.jurisdiction && filters.jurisdiction !== 'All') {
          filtered = filtered.filter(c => c.jurisdiction === filters.jurisdiction);
        }
        
        if (filters.search) {
          const q = filters.search.toLowerCase();
          filtered = filtered.filter(c =>
            c.id.toLowerCase().includes(q) ||
            c.caseNumber.toLowerCase().includes(q) ||
            c.complainant.name.toLowerCase().includes(q) ||
            c.issueType.toLowerCase().includes(q) ||
            c.status.toLowerCase().includes(q)
          );
        }
        
        const page = filters.page || 1;
        const pageSize = filters.pageSize || 10;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        
        return {
          cases: filtered.slice(start, end),
          total: filtered.length,
          page,
          pageSize,
          totalPages: Math.ceil(filtered.length / pageSize),
        };
      } else {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.type) params.append('type', filters.type);
        if (filters.jurisdiction) params.append('jurisdiction', filters.jurisdiction);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page);
        if (filters.pageSize) params.append('pageSize', filters.pageSize);
        
        const response = await fetch(`${API_BASE_URL}/cases?${params}`);
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data || data;
      }
    } catch (error) {
      console.error('Cases API error:', error);
      throw new Error(error.message || 'Failed to fetch cases');
    }
  },

  /**
   * Fetch a single case by ID
   * @param {string} caseId
   * @returns {Promise<Object>}
   */
  async getById(caseId) {
    const isDemoMode = getDemoMode();
    
    try {
      if (isDemoMode) {
        await delay(300);
        const { ALL_CASES } = await import('../data/cases');
        const caseData = ALL_CASES.find(c => c.id === caseId);
        if (!caseData) {
          throw new Error(`Case ${caseId} not found`);
        }
        return caseData;
      } else {
        const response = await fetch(`${API_BASE_URL}/cases/${caseId}`);
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data || data;
      }
    } catch (error) {
      console.error('Cases API error:', error);
      throw new Error(error.message || 'Failed to fetch case');
    }
  },

  /**
   * Update case status
   * @param {string} caseId
   * @param {string} status
   * @returns {Promise<Object>}
   */
  async updateStatus(caseId, status) {
    const isDemoMode = getDemoMode();
    
    try {
      if (isDemoMode) {
        await delay(500);
        const caseData = await this.getById(caseId);
        return { ...caseData, status };
      } else {
        const response = await fetch(`${API_BASE_URL}/cases/${caseId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.data || data;
      }
    } catch (error) {
      console.error('Update status error:', error);
      throw new Error(error.message || 'Failed to update case status');
    }
  },
};

/**
 * AI API - Uses platform adapter for reasoning
 */
export const aiAPI = {
  /**
   * Execute AI reasoning on a case
   * @param {Object} caseData - Case to analyze
   * @param {Function} onStep - Callback for streaming reasoning steps
   * @returns {Promise<Object>} Reasoning results
   */
  async analyzeCase(caseData, onStep = null) {
    const isDemoMode = getDemoMode();
    
    try {
      if (isDemoMode) {
        if (!caseData) {
          throw new Error('Case is required for analysis');
        }
        const { executeReasoning } = await import('./ai/platformAdapter.js');
        const result = await executeReasoning(caseData, onStep);
        return result;
      } else {
        // Backend mode would use SSE streaming similar to Cogniclaim
        const caseId = typeof caseData === 'string' ? caseData : caseData?.id;
        const caseDataObj = typeof caseData === 'object' ? caseData : null;
        
        if (!caseId && !caseDataObj) {
          throw new Error('Case ID or case data is required');
        }
        
        // Similar SSE implementation as Cogniclaim
        return new Promise((resolve, reject) => {
          const requestBody = caseId ? { caseId } : { case: caseDataObj };
          
          fetch(`${API_BASE_URL}/ai/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            // SSE streaming implementation (similar to Cogniclaim)
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let finalResult = null;
            
            const processStream = () => {
              reader.read().then(({ done, value }) => {
                if (done) {
                  if (finalResult) {
                    resolve(finalResult);
                  } else {
                    reject(new Error('Stream ended without result'));
                  }
                  return;
                }
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n\n');
                buffer = lines.pop() || '';
                
                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    try {
                      const data = JSON.parse(line.substring(6));
                      
                      if (data.type === 'step') {
                        if (onStep) {
                          onStep(data.step);
                        }
                      } else if (data.type === 'complete') {
                        finalResult = data.result;
                      } else if (data.type === 'error') {
                        reject(new Error(data.error));
                        return;
                      }
                    } catch (parseError) {
                      console.error('Error parsing SSE data:', parseError);
                    }
                  }
                }
                
                processStream();
              }).catch(reject);
            };
            
            processStream();
          })
          .catch(reject);
        });
      }
    } catch (error) {
      console.error('AI reasoning error:', error);
      throw new Error(error.message || 'Failed to analyze case');
    }
  },

  /**
   * Send a message to the AI chat assistant
   * @param {string} message - User message
   * @param {Object} context - { case, reasoningSteps, caseId }
   * @param {Function} onToken - Callback for streaming tokens
   * @returns {Promise<Object>} Chat response
   */
  async sendMessage(message, context = {}, onToken = null) {
    const isDemoMode = getDemoMode();
    
    try {
      if (!message || !message.trim()) {
        throw new Error('Message is required');
      }
      
      if (isDemoMode) {
        const { sendChatMessage } = await import('./ai/platformAdapter.js');
        const response = await sendChatMessage(message, context, onToken);
        return response;
      } else {
        // Backend mode SSE implementation
        const conversationHistory = context.conversationHistory || [];
        const caseId = context.caseId || context.case?.id;
        
        return new Promise((resolve, reject) => {
          fetch(`${API_BASE_URL}/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message,
              caseId,
              conversationHistory,
            }),
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            // SSE streaming for chat (similar to Cogniclaim)
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let fullResponse = '';
            let finalResult = null;
            
            const processStream = () => {
              reader.read().then(({ done, value }) => {
                if (done) {
                  if (finalResult) {
                    resolve({
                      text: finalResult.response || fullResponse,
                      sopRefs: finalResult.sopReferences?.map(sop => sop.page || sop.title) || [],
                      suggestions: [],
                    });
                  } else {
                    resolve({
                      text: fullResponse,
                      sopRefs: [],
                      suggestions: [],
                    });
                  }
                  return;
                }
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n\n');
                buffer = lines.pop() || '';
                
                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    try {
                      const data = JSON.parse(line.substring(6));
                      
                      if (data.type === 'token') {
                        fullResponse += data.token;
                        if (onToken) {
                          onToken(data.token);
                        }
                      } else if (data.type === 'complete') {
                        finalResult = data.result;
                      } else if (data.type === 'error') {
                        reject(new Error(data.error));
                        return;
                      }
                    } catch (parseError) {
                      console.error('Error parsing SSE data:', parseError);
                    }
                  }
                }
                
                processStream();
              }).catch(reject);
            };
            
            processStream();
          })
          .catch(reject);
        });
      }
    } catch (error) {
      console.error('AI chat error:', error);
      throw new Error(error.message || 'Failed to get AI response');
    }
  },
};

export default {
  cases: casesAPI,
  ai: aiAPI,
};


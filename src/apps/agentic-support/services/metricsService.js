/**
 * Metrics service for fetching observability data
 * Author: Vinod Kumar V (VKV)
 */

const API_BASE_URL = "http://localhost:8000/api/v1/metrics";

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(date) {
  if (!date) return null;
  if (typeof date === "string") return date;
  return date.toISOString().split("T")[0];
}

/**
 * Get date range for preset options
 */
function getDateRange(preset) {
  const now = new Date();
  const toDate = formatDate(now);
  
  switch (preset) {
    case "24h":
      const yesterday = new Date(now);
      yesterday.setHours(yesterday.getHours() - 24);
      return { from_date: formatDate(yesterday), to_date: toDate };
    case "7d":
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return { from_date: formatDate(weekAgo), to_date: toDate };
    case "30d":
      const monthAgo = new Date(now);
      monthAgo.setDate(monthAgo.getDate() - 30);
      return { from_date: formatDate(monthAgo), to_date: toDate };
    case "90d":
      const quarterAgo = new Date(now);
      quarterAgo.setDate(quarterAgo.getDate() - 90);
      return { from_date: formatDate(quarterAgo), to_date: toDate };
    default:
      return { from_date: null, to_date: null };
  }
}

/**
 * Build query string from params
 */
function buildQueryString(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      query.append(key, value);
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Fetch with error handling
 */
async function fetchMetrics(endpoint, params = {}) {
  try {
    const queryString = buildQueryString(params);
    const url = `${API_BASE_URL}${endpoint}${queryString}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    // Return mock data on error for demo purposes
    return getMockData(endpoint);
  }
}

/**
 * Get mock data for demo purposes
 */
function getMockData(endpoint) {
  if (endpoint === "/channels") {
    return {
      channels: [
        { channel: "voice", volume: 12847, auto_resolved: 8450, escalated: 2280 },
        { channel: "chat", volume: 9876, auto_resolved: 7200, escalated: 1200 },
        { channel: "email", volume: 4532, auto_resolved: 3200, escalated: 800 },
        { channel: "sms", volume: 2345, auto_resolved: 1800, escalated: 400 },
        { channel: "whatsapp", volume: 1234, auto_resolved: 900, escalated: 200 },
        { channel: "web", volume: 5678, auto_resolved: 4500, escalated: 800 },
        { channel: "mobile", volume: 3456, auto_resolved: 2800, escalated: 500 },
        { channel: "api", volume: 890, auto_resolved: 750, escalated: 100 },
      ],
    };
  }
  
  if (endpoint === "/kpi") {
    return {
      self_heal_rate: 78.5,
      avg_resolution_time_seconds: 144, // 2.4 minutes
      cost_savings_usd: 12300,
      total_tickets: 1250,
      auto_resolved: 980,
      escalated: 270,
    };
  }
  
  if (endpoint === "/agents") {
    return {
      agents: [
        {
          agent_name: "intent_detection",
          execution_count: 1250,
          successful_executions: 1180,
          failed_executions: 70,
          success_rate: 94.4,
          avg_latency_ms: 245,
          total_tokens: 12500,
          total_cost_usd: 0.42,
        },
        {
          agent_name: "diagnostic",
          execution_count: 1180,
          successful_executions: 1120,
          failed_executions: 60,
          success_rate: 94.9,
          avg_latency_ms: 320,
          total_tokens: 18500,
          total_cost_usd: 0.68,
        },
        {
          agent_name: "action_execution",
          execution_count: 1120,
          successful_executions: 1080,
          failed_executions: 40,
          success_rate: 96.4,
          avg_latency_ms: 180,
          total_tokens: 8200,
          total_cost_usd: 0.31,
        },
        {
          agent_name: "verification",
          execution_count: 1080,
          successful_executions: 1050,
          failed_executions: 30,
          success_rate: 97.2,
          avg_latency_ms: 150,
          total_tokens: 6500,
          total_cost_usd: 0.24,
        },
        {
          agent_name: "escalation_decision",
          execution_count: 1080,
          successful_executions: 1050,
          failed_executions: 30,
          success_rate: 97.2,
          avg_latency_ms: 120,
          total_tokens: 4200,
          total_cost_usd: 0.16,
        },
      ],
    };
  }
  
  if (endpoint.startsWith("/categories")) {
    return {
      categories: [
        {
          category_id: "printer_troubleshooting",
          category_name: "Printer Troubleshooting",
          date: new Date().toISOString().split("T")[0],
          total_tickets: 1250,
          successful_tickets: 1025,
          failed_tickets: 225,
          success_rate: 82.0,
          avg_latency_ms: 2100,
          total_tokens: 125000,
          total_cost_usd: 4.5,
        },
        {
          category_id: "hardware_diagnostics",
          category_name: "Hardware Diagnostics",
          date: new Date().toISOString().split("T")[0],
          total_tickets: 850,
          successful_tickets: 680,
          failed_tickets: 170,
          success_rate: 80.0,
          avg_latency_ms: 2800,
          total_tokens: 98000,
          total_cost_usd: 3.8,
        },
        {
          category_id: "network_connectivity",
          category_name: "Network Connectivity",
          date: new Date().toISOString().split("T")[0],
          total_tickets: 420,
          successful_tickets: 340,
          failed_tickets: 80,
          success_rate: 81.0,
          avg_latency_ms: 1900,
          total_tokens: 52000,
          total_cost_usd: 2.1,
        },
      ],
      resolution: {
        total: 2520,
        breakdown: {
          "auto-resolved": { count: 1960, percentage: 77.8, avg_mtr_seconds: 126 },
          escalated: { count: 480, percentage: 19.0, avg_mtr_seconds: 510 },
          failed: { count: 80, percentage: 3.2, avg_mtr_seconds: 0 },
        },
        // Category-specific breakdown
        by_category: {
          printer_troubleshooting: {
            total: 1250,
            auto_resolved: 975,
            escalated: 250,
            failed: 25,
            avg_mtr_auto: 126,
            avg_mtr_escalated: 480,
          },
          hardware_diagnostics: {
            total: 850,
            auto_resolved: 612,
            escalated: 204,
            failed: 34,
            avg_mtr_auto: 168,
            avg_mtr_escalated: 540,
          },
          network_connectivity: {
            total: 420,
            auto_resolved: 340,
            escalated: 68,
            failed: 12,
            avg_mtr_auto: 95,
            avg_mtr_escalated: 600,
          },
        },
      },
    };
  }
  
  if (endpoint === "/collaboration") {
    return {
      autonomous_agent_chain: {
        volume: 8450,
        success_rate: 94.0,
        avg_latency_ms: 1800,
        cost_per_resolution_usd: 0.12,
      },
      ai_to_human_handoff: {
        volume: 2280,
        handoff_rate: 21.3,
        avg_handoff_time_seconds: 3.2,
        human_resolution_rate: 88.0,
      },
      human_initiated_ai_assist: {
        volume: 1720,
        delegation_rate: 15.2,
        ai_success_rate: 89.0,
        time_saved_minutes: 4.2,
      },
    };
  }
  
  if (endpoint === "/insights") {
    return {
      insights: [
        {
          category_id: "printer_troubleshooting",
          category_name: "Printer Offline Issues",
          ai_handled: {
            resolution_rate: 88.0,
            avg_time_seconds: 168,
            accuracy: 91.0,
            cost_usd: 0.15,
          },
          human_handled: {
            resolution_rate: 82.0,
            avg_time_seconds: 432,
            csat: 4.3,
            cost_usd: 12.50,
          },
        },
        {
          category_id: "hardware_diagnostics",
          category_name: "Laptop Performance Issues",
          ai_handled: {
            resolution_rate: 82.0,
            avg_time_seconds: 216,
            accuracy: 86.0,
            cost_usd: 0.18,
          },
          human_handled: {
            resolution_rate: 76.0,
            avg_time_seconds: 570,
            csat: 4.1,
            cost_usd: 12.50,
          },
        },
        {
          category_id: "network_connectivity",
          category_name: "Network Connectivity Issues",
          ai_handled: {
            resolution_rate: 75.0,
            avg_time_seconds: 288,
            accuracy: 82.0,
            cost_usd: 0.20,
          },
          human_handled: {
            resolution_rate: 71.0,
            avg_time_seconds: 708,
            csat: 4.0,
            cost_usd: 12.50,
          },
        },
      ],
    };
  }
  
  if (endpoint === "/alerts") {
    return {
      alerts: [
        {
          type: "performance",
          severity: "warning",
          title: "High Latency Detected",
          description: "Diagnostic Agent averaging 3.2s (threshold: 2.0s) for Printer Offline workflows",
          timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        },
        {
          type: "volume_spike",
          severity: "info",
          title: "Laptop Issue Volume Spike",
          description: "Display flickering issues up 23% - investigating root cause",
          timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
        },
        {
          type: "cost",
          severity: "error",
          title: "Token Usage Anomaly",
          description: "Knowledge Base Agent using 2.3x average tokens - possible prompt issue",
          timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        },
        {
          type: "success_rate",
          severity: "warning",
          title: "Success Rate Decline",
          description: "Network Issues category success rate dropped to 68% (7-day avg: 82%)",
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        },
      ],
    };
  }
  
  return {};
}

/**
 * Get entry channel volumes
 */
export async function getChannelMetrics(dateRange = "7d") {
  const { from_date, to_date } = getDateRange(dateRange);
  return fetchMetrics("/channels", { from_date, to_date });
}

/**
 * Get key performance indicators
 */
export async function getKPIMetrics(dateRange = "7d") {
  const { from_date, to_date } = getDateRange(dateRange);
  return fetchMetrics("/kpi", { from_date, to_date });
}

/**
 * Get agent performance data
 */
export async function getAgentMetrics(agentName = null, dateRange = "7d") {
  const { from_date, to_date } = getDateRange(dateRange);
  const params = { from_date, to_date };
  if (agentName) {
    params.agent_name = agentName;
  }
  return fetchMetrics("/agents", params);
}

/**
 * Get agent execution details
 */
export async function getAgentDetails(agentName, dateRange = "7d", limit = 100) {
  const { from_date, to_date } = getDateRange(dateRange);
  return fetchMetrics(`/agents/${agentName}/details`, { from_date, to_date, limit });
}

/**
 * Get category performance data
 */
export async function getCategoryMetrics(categoryId = null, dateRange = "7d") {
  const { from_date, to_date } = getDateRange(dateRange);
  const params = { from_date, to_date };
  if (categoryId) {
    params.category_id = categoryId;
  }
  return fetchMetrics("/categories", params);
}

/**
 * Get collaboration patterns
 */
export async function getCollaborationMetrics(dateRange = "7d") {
  const { from_date, to_date } = getDateRange(dateRange);
  return fetchMetrics("/collaboration", { from_date, to_date });
}

/**
 * Get category insights
 */
export async function getInsights(dateRange = "7d") {
  const { from_date, to_date } = getDateRange(dateRange);
  return fetchMetrics("/insights", { from_date, to_date });
}

/**
 * Get system alerts
 */
export async function getAlerts(dateRange = "7d") {
  const { from_date, to_date } = getDateRange(dateRange);
  return fetchMetrics("/alerts", { from_date, to_date });
}

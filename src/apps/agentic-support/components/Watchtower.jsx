/**
 * AI Watchtower - Observability Dashboard
 * Real-time agent orchestration & workflow intelligence
 * Author: Vinod Kumar V (VKV)
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  RefreshCw,
  Eye,
  Gauge,
  Server,
  CheckCircle2,
  Zap,
} from "lucide-react";

// Sub-components
import ChannelCard from "./watchtower/ChannelCard";
import KPICard from "./watchtower/KPICard";
import AgentPerformanceCard from "./watchtower/AgentPerformanceCard";
import CategoryPerformanceCard from "./watchtower/CategoryPerformanceCard";
import CollaborationPanel from "./watchtower/CollaborationPanel";
import CollaborationFlow from "./watchtower/CollaborationFlow";
import AlertCard from "./watchtower/AlertCard";
import DateRangeSelector from "./watchtower/DateRangeSelector";
import ViewToggle from "./watchtower/ViewToggle";

// Services
import {
  getChannelMetrics,
  getKPIMetrics,
  getAgentMetrics,
  getCategoryMetrics,
  getCollaborationMetrics,
  getInsights,
  getAlerts,
} from "../services/metricsService";

export default function Watchtower({ onNavigate }) {
  const [dateRange, setDateRange] = useState("7d");
  const [viewMode, setViewMode] = useState("agent"); // "agent" | "category"
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Data state
  const [channels, setChannels] = useState([]);
  const [kpi, setKpi] = useState(null);
  const [agents, setAgents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState(null);
  const [collaboration, setCollaboration] = useState(null);
  const [insights, setInsights] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Fetch all metrics
  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const [
        channelsData,
        kpiData,
        agentsData,
        categoriesData,
        collaborationData,
        insightsData,
        alertsData,
      ] = await Promise.all([
        getChannelMetrics(dateRange),
        getKPIMetrics(dateRange),
        getAgentMetrics(null, dateRange),
        getCategoryMetrics(null, dateRange),
        getCollaborationMetrics(dateRange),
        getInsights(dateRange),
        getAlerts(dateRange),
      ]);

      setChannels(channelsData.channels || []);
      setKpi(kpiData);
      setAgents(agentsData.agents || []);
      setCategories(categoriesData.categories || []);
      setCategoriesData(categoriesData);
      setCollaboration(collaborationData);
      setInsights(insightsData.insights || []);
      setAlerts(alertsData.alerts || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [dateRange]);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Simple Header - No Purple Hero */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              AI Watchtower
            </h1>
            <p className="text-gray-600">
              Real-time agent orchestration & workflow intelligence
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DateRangeSelector value={dateRange} onChange={setDateRange} />
            <ViewToggle value={viewMode} onChange={setViewMode} />
            <button
              onClick={fetchMetrics}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-[#780096] rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            {lastUpdate && (
              <span className="text-xs text-gray-500">
                Updated {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Entry Channels Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Interaction Entry Points</h2>
          <p className="text-sm text-gray-500">Volume by customer contact channel</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {channels.map((channel) => (
            <div key={channel.channel} className="flex-shrink-0 w-48">
              <ChannelCard {...channel} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Key Performance Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        <KPICard
          type="self_heal"
          value={`${kpi?.self_heal_rate?.toFixed(1) || 0}%`}
          subtitle="AI-resolved without escalation"
        />
        <KPICard
          type="resolution_time"
          value={kpi ? formatTime(kpi.avg_resolution_time_seconds) : "0s"}
          subtitle="Mean time to resolution"
        />
        <KPICard
          type="cost_efficiency"
          value={`$${((kpi?.cost_savings_usd || 0) / 1000).toFixed(1)}K saved`}
          subtitle="vs. human-only support"
        />
      </motion.div>

      {/* Agent Performance View or Category View */}
      {viewMode === "agent" ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">AI Agent Orchestration</h2>
            <p className="text-sm text-gray-500">Individual agent performance & collaboration patterns</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {agents.map((agent) => (
                <AgentPerformanceCard
                  key={agent.agent_name}
                  agent={agent}
                  onClick={() => {
                    // TODO: Open agent details drawer
                    console.log("Open agent details:", agent.agent_name);
                  }}
                />
              ))}
            </div>
            <div className="rounded-lg border border-gray-200 bg-white">
              <CollaborationFlow agents={agents} />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Workflow Category Performance</h2>
            <p className="text-sm text-gray-500">Resolution distribution by device issue category</p>
          </div>
          
          {/* Stacked Bar Chart with Category-Specific Data */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 mb-6">
            <div className="text-sm text-gray-600 mb-4">Volume Distribution by Category</div>
            <div className="h-64 flex items-end gap-6">
              {categories.map((cat) => {
                const total = cat.total_tickets || 0;
                // Use category-specific breakdown if available
                const categoryBreakdown = categoriesData?.resolution?.by_category?.[cat.category_id];
                const auto = categoryBreakdown?.auto_resolved || Math.floor((cat.successful_tickets || 0) * 0.75);
                const escalated = categoryBreakdown?.escalated || ((cat.successful_tickets || 0) - auto);
                const failed = categoryBreakdown?.failed || cat.failed_tickets || 0;
                const maxHeight = 200;
                const maxTotal = Math.max(...categories.map(c => c.total_tickets || 0));
                const barHeight = (total / maxTotal) * maxHeight;
                
                return (
                  <div key={cat.category_id} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col-reverse gap-0.5" style={{ height: barHeight }}>
                      <div
                        className="bg-green-100 border border-green-300 rounded-t"
                        style={{ height: `${(auto / total) * 100}%` }}
                        title={`Auto-resolved: ${auto} (${Math.round((auto / total) * 100)}%)`}
                      />
                      <div
                        className="bg-amber-100 border border-amber-300"
                        style={{ height: `${(escalated / total) * 100}%` }}
                        title={`Escalated: ${escalated} (${Math.round((escalated / total) * 100)}%)`}
                      />
                      <div
                        className="bg-red-100 border border-red-300 rounded-b"
                        style={{ height: `${(failed / total) * 100}%` }}
                        title={`Failed: ${failed} (${Math.round((failed / total) * 100)}%)`}
                      />
                    </div>
                    <div className="mt-3 text-xs font-medium text-gray-700 text-center">
                      {cat.category_name.split(" ")[0]}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {total.toLocaleString()} total
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded" />
                <span className="text-xs text-gray-600">AI Auto-Resolved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-100 border border-amber-300 rounded" />
                <span className="text-xs text-gray-600">Escalated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded" />
                <span className="text-xs text-gray-600">Failed</span>
              </div>
            </div>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryPerformanceCard key={category.category_id} category={category} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Agent Collaboration Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Agent Collaboration Modes</h2>
          <p className="text-sm text-gray-500">How AI agents work together and with humans</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collaboration && (
            <>
              <CollaborationPanel
                type="autonomous"
                data={collaboration.autonomous_agent_chain || {}}
              />
              <CollaborationPanel
                type="ai_to_human"
                data={collaboration.ai_to_human_handoff || {}}
              />
              <CollaborationPanel
                type="human_to_ai"
                data={collaboration.human_initiated_ai_assist || {}}
              />
            </>
          )}
        </div>
      </motion.div>

      {/* Intelligent Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Performance Insights by Device Category</h2>
          <p className="text-sm text-gray-500">AI vs Human resolution comparison</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {insights.map((insight) => (
            <div
              key={insight.category_id}
              className={`flex-shrink-0 w-96 rounded-lg border p-6 bg-white ${
                insight.ai_handled.resolution_rate > insight.human_handled.resolution_rate
                  ? "border-green-200"
                  : "border-gray-200"
              }`}
            >
              <div className="font-bold text-gray-900 mb-4">{insight.category_name}</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-2">AI-Handled</div>
                  <div className="space-y-1 text-sm">
                    <div>Resolution: {insight.ai_handled.resolution_rate}%</div>
                    <div>Time: {formatTime(insight.ai_handled.avg_time_seconds)}</div>
                    <div>Accuracy: {insight.ai_handled.accuracy}%</div>
                    <div>Cost: ${insight.ai_handled.cost_usd.toFixed(2)}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">Human-Handled</div>
                  <div className="space-y-1 text-sm">
                    <div>Resolution: {insight.human_handled.resolution_rate}%</div>
                    <div>Time: {formatTime(insight.human_handled.avg_time_seconds)}</div>
                    <div>CSAT: {insight.human_handled.csat}/5</div>
                    <div>Cost: ${insight.human_handled.cost_usd.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* System Health & Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">System Health & Anomalies</h2>
            <p className="text-sm text-gray-500">Real-time alerts and performance anomalies</p>
          </div>
          {alerts.length > 3 && (
            <button className="text-sm text-[#780096] hover:underline">
              View All &gt;
            </button>
          )}
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {alerts.slice(0, 3).map((alert, idx) => (
            <div key={idx} className="flex-shrink-0 w-80">
              <AlertCard alert={alert} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

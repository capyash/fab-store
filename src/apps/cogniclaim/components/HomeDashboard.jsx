import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { aiInsightsAPI, claimsAPI } from "../services/api";
import {
  Activity,
  ShieldAlert,
  Clock,
  AlertTriangle,
  Zap,
  DollarSign,
  Target,
  TrendingDown,
  Users,
  FileCheck,
  Timer,
  Brain,
  TrendingUp as TrendingUpIcon,
  AlertCircle,
  ArrowRight,
  Store,
} from "lucide-react";

// Actionable items - things users should act on
const actionableItems = [
  {
    title: "3 claims may miss SOP 4.5.2 escalation window",
    detail: "Auto-create follow-ups in the next 12 hours.",
    icon: Timer,
    type: "warning",
    metric: "12h",
    action: "Create follow-ups",
    priority: "high",
    link: "worklist",
  },
  // TODO(VKV): Revisit - Hidden for now
  // {
  //   title: "High-value claim identified: ₹45K potential recovery",
  //   detail: "Claim #C-2024-0892 requires immediate attention (SOP 5.1.3).",
  //   icon: Target,
  //   type: "opportunity",
  //   metric: "₹45K",
  //   action: "Review claim",
  //   priority: "high",
  //   link: "worklist",
  // },
  {
    title: "Anomaly detected: Unusual delay pattern in GlobalMed claims",
    detail: "AI identified 5 claims with 2x longer processing time. Root cause analysis suggests missing documentation.",
    icon: AlertCircle,
    type: "anomaly",
    metric: "5x",
    action: "Investigate",
    priority: "medium",
    link: "worklist",
  },
  {
    title: "Predictive alert: 8 claims likely to escalate next week",
    detail: "Based on historical patterns and current status, 92% confidence these will require escalation.",
    icon: Brain,
    type: "prediction",
    metric: "92%",
    action: "Prevent escalation",
    priority: "medium",
    link: "worklist",
  },
  // TODO(VKV): Revisit - Hidden for now
  // {
  //   title: "Pattern spotted: missing pre-auth docs (SOP 3.2.1)",
  //   detail: "Recurring with Apex Health — consider template reminder.",
  //   icon: FileCheck,
  //   type: "pattern",
  //   metric: "8x",
  //   action: "Setup template",
  //   priority: "low",
  //   link: "worklist",
  // },
  // TODO(VKV): Revisit - Hidden for now
  // {
  //   title: "Revenue recovery opportunity: ₹2.3M in pending claims",
  //   detail: "Focus on high-value claims in 'Pending Review' status for maximum impact.",
  //   icon: DollarSign,
  //   type: "opportunity",
  //   metric: "₹2.3M",
  //   action: "View claims",
  //   priority: "high",
  //   link: "worklist",
  // },
];

// Informational insights - metrics and trends for awareness
const informationalInsights = [
  {
    title: "Claims In Progress",
    detail: "48 claims currently being processed",
    icon: Activity,
    type: "metric",
    metric: "48",
    delta: "+6",
    gradient: "from-primary to-primary",
  },
  {
    title: "Pending Pre-Auth",
    detail: "12 claims awaiting pre-authorization",
    icon: ShieldAlert,
    type: "metric",
    metric: "12",
    delta: "-2",
    gradient: "from-neutral02 to-neutral02",
  },
  {
    title: "Avg. Turnaround",
    detail: "3.2 days average processing time",
    icon: Clock,
    type: "metric",
    metric: "3.2d",
    delta: "-14%",
    gradient: "from-primary to-primary",
  },
  {
    title: "Agent Efficiency",
    detail: "87% completion rate this week",
    icon: Users,
    type: "metric",
    metric: "87%",
    delta: "+5%",
    gradient: "from-success02 to-success03",
  },
  {
    title: "Revenue Recovery",
    detail: "₹12.5M recovered this month",
    icon: DollarSign,
    type: "metric",
    metric: "₹12.5M",
    delta: "+18%",
    gradient: "from-alert02 to-alert02",
  },
  {
    title: "High-Value Opportunities",
    detail: "23 claims over ₹50K pending review",
    icon: Target,
    type: "metric",
    metric: "23",
    delta: "+3",
    gradient: "from-error02 to-error03",
  },
];

const typeColors = {
  warning: "from-error01 to-alert01 border-error03/30",
  opportunity: "from-success01 to-success01 border-success03/30",
  anomaly: "from-textLink/20 to-pinkTP/20 border-textLink/30",
  prediction: "from-neutral01 to-neutral01 border-neutral02/30",
  pattern: "from-alert01 to-alert01 border-alert02/30",
  metric: "from-bg02 to-bg02 border-stroke01",
};

const iconColors = {
  warning: "text-error02",
  opportunity: "text-success02",
  anomaly: "text-textLink",
  prediction: "text-neutral02",
  pattern: "text-alert02",
  metric: "text-text03",
};

const priorityColors = {
  high: "bg-error01 text-error02 border-error03",
  medium: "bg-alert01 text-alert02 border-alert02",
  low: "bg-neutral01 text-neutral02 border-neutral02",
};

export default function HomeDashboard({ onNavigate, onSelectClaim }) {
  const [priorityQueue, setPriorityQueue] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loadingPriority, setLoadingPriority] = useState(true);
  const [loadingAnomalies, setLoadingAnomalies] = useState(true);

  // Load AI Priority Queue
  useEffect(() => {
    const loadPriorityQueue = async () => {
      setLoadingPriority(true);
      try {
        const data = await aiInsightsAPI.getPriorityQueue({ limit: 5 });
        setPriorityQueue(data);
      } catch (error) {
        console.error("Failed to load priority queue:", error);
      } finally {
        setLoadingPriority(false);
      }
    };
    loadPriorityQueue();
    // Refresh every 60 seconds
    const interval = setInterval(loadPriorityQueue, 60000);
    return () => clearInterval(interval);
  }, []);

  // Load AI Anomalies
  useEffect(() => {
    const loadAnomalies = async () => {
      setLoadingAnomalies(true);
      try {
        const data = await aiInsightsAPI.getAnomalies();
        setAnomalies(data);
      } catch (error) {
        console.error("Failed to load anomalies:", error);
      } finally {
        setLoadingAnomalies(false);
      }
    };
    loadAnomalies();
    // Refresh every 120 seconds
    const interval = setInterval(loadAnomalies, 120000);
    return () => clearInterval(interval);
  }, []);

  const handleActionClick = (item) => {
    if (item.link && onNavigate) {
      onNavigate(item.link);
    }
  };

  const handleClaimClick = async (claimId) => {
    if (onSelectClaim) {
      const claim = await claimsAPI.getById(claimId);
      if (claim) {
        onSelectClaim(claim);
        onNavigate?.("worklist");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* AI Watchtower Section - Main Focus */}
      <div className="bg-bg01 rounded-lg border border-stroke01 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-primary shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text01 mb-2">AI Watchtower</h1>
              <p className="text-sm text-text03 mt-1">Real-time insights, metrics &amp; actionable items for your claims processing workflow</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg01/80 backdrop-blur text-xs font-medium text-primary border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-success03 animate-pulse" />
              Live
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate("store")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text03 hover:text-primary rounded-lg hover:bg-hover transition-colors"
                title="Back to FAB Store"
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Store</span>
              </button>
            )}
          </div>
        </div>

        {/* SLA & Late Payment Penalty Risk Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border-2 border-error03 bg-gradient-to-br from-error01 to-alert01 p-6 shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-error01">
                  <AlertTriangle className="w-5 h-5 text-error02" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text01 mb-1">
                    SLA Breach & Late Payment Penalty Risk
                  </h3>
                  <p className="text-sm text-text03">
                    Claims that missed processing deadlines and may incur penalties
                  </p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-error01 text-error02 text-xs font-semibold">
                Critical
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Total Claims Missed SLA - YTD */}
              <div className="bg-bg01/80 rounded-lg p-4 border border-error01">
                <div className="text-xs text-text03 mb-1">Missed SLA (YTD)</div>
                <div className="text-2xl font-bold text-error03 mb-1">1,247</div>
                <div className="text-xs text-text03">claims</div>
              </div>

              {/* Total Claims Missed SLA - QTD */}
              <div className="bg-bg01/80 rounded-lg p-4 border border-error01">
                <div className="text-xs text-text03 mb-1">Missed SLA (QTD)</div>
                <div className="text-2xl font-bold text-error03 mb-1">312</div>
                <div className="text-xs text-text03">claims</div>
              </div>

              {/* Estimated Penalty Risk */}
              <div className="bg-bg01/80 rounded-lg p-4 border border-alert01">
                <div className="text-xs text-text03 mb-1">Penalty Risk (YTD)</div>
                <div className="text-2xl font-bold text-alert02 mb-1">$4.2M</div>
                <div className="text-xs text-text03">estimated</div>
              </div>

              {/* Penalty Risk - QTD */}
              <div className="bg-bg01/80 rounded-lg p-4 border border-alert01">
                <div className="text-xs text-text03 mb-1">Penalty Risk (QTD)</div>
                <div className="text-2xl font-bold text-alert02 mb-1">$1.1M</div>
                <div className="text-xs text-text03">estimated</div>
              </div>
            </div>

            {/* Top States by Total At-Risk Value (sum of all SLA-breached claims = total exposure) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg01/80 rounded-lg p-4 border border-error01">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-text01 uppercase tracking-wide">
                    Total At-Risk Value - Texas
                  </div>
                  <div className="px-2 py-1 rounded bg-neutral01 text-neutral02 text-xs font-semibold">
                    TX
                  </div>
                </div>
                <div className="text-3xl font-bold text-error03 mb-1">$20.0M</div>
                <div className="text-xs text-text03">Sum of all SLA-breached claims • 247 claims</div>
                <div className="mt-2 text-xs text-alert02 font-medium">
                  Potential penalty: ~$600K
                </div>
              </div>

              <div className="bg-bg01/80 rounded-lg p-4 border border-error01">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-text01 uppercase tracking-wide">
                    Total At-Risk Value - Michigan
                  </div>
                  <div className="px-2 py-1 rounded bg-success01 text-success02 text-xs font-semibold">
                    MI
                  </div>
                </div>
                <div className="text-3xl font-bold text-error03 mb-1">$14.8M</div>
                <div className="text-xs text-text03">Sum of all SLA-breached claims • 189 claims</div>
                <div className="mt-2 text-xs text-alert02 font-medium">
                  Potential penalty: ~$445K
                </div>
              </div>
            </div>

            {/* Cogniclaim Value Proposition */}
            <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-primary/10 rounded-lg border border-primary/30">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-text01 mb-1">
                    Cogniclaim Impact
                  </div>
                  <div className="text-xs text-text01">
                    AI-powered prioritization can prevent <span className="font-semibold text-primary">~65% of SLA breaches</span> by
                    identifying high-risk claims early and routing them to appropriate workflows. Estimated savings: <span className="font-semibold">$2.7M annually</span> in avoided penalties.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-error03">
              <button
                onClick={() => onNavigate?.("worklist")}
                className="text-sm font-semibold text-error02 hover:text-error03 flex items-center gap-2"
              >
                → Review all SLA-breached claims
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* NEW: AI-Powered Priority Queue */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-neutral02/20 to-primary/20 border border-neutral02/30">
              <Brain className="w-4 h-4 text-neutral02" />
            </div>
            <h3 className="text-lg font-semibold text-text01">AI-Powered Priority Queue</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-neutral01 text-neutral02 font-medium">
              🤖 AI Recommended
            </span>
          </div>
          {loadingPriority ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-32 bg-bg02 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : priorityQueue.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {priorityQueue.map((claim, idx) => (
                <motion.div
                  key={claim.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleClaimClick(claim.id)}
                  className="rounded-xl border-2 bg-gradient-to-br from-neutral01 to-bg02 border-neutral02 bg-white/90 backdrop-blur p-4 hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-text03 mb-1">Priority #{idx + 1}</div>
                      <div className="text-sm font-bold text-text01 mb-1">{claim.id}</div>
                      <div className="text-xs text-text03">{claim.member}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-xs font-bold ${
                      claim.aiRiskLevel === 'high' ? 'bg-error01 text-error02' :
                      claim.aiRiskLevel === 'medium' ? 'bg-alert01 text-alert02' :
                      'bg-success01 text-success02'
                    }`}>
                      {claim.aiPriority?.toFixed(1)}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-text01 mb-2">
                    ₹{(claim.amount / 1000).toFixed(0)}K
                  </div>
                  {claim.aiReasons && claim.aiReasons.length > 0 && (
                    <div className="text-xs text-text03 line-clamp-2">
                      {claim.aiReasons[0]}
                    </div>
                  )}
                  <div className="mt-2 pt-2 border-t border-neutral02">
                    <div className="text-xs text-neutral02 font-medium">
                      → Review claim
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text03">
              No prioritized claims available
            </div>
          )}
        </div>

        {/* NEW: AI Anomaly Detection Panel */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-textLink/20 to-pinkTP/20 border border-textLink/30">
              <AlertCircle className="w-4 h-4 text-textLink" />
            </div>
            <h3 className="text-lg font-semibold text-text01">Anomaly Detection</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-error01 text-error02 font-medium">
              🤖 AI Detected
            </span>
          </div>
          {loadingAnomalies ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-bg02 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : anomalies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {anomalies.map((anomaly, idx) => (
                <motion.div
                  key={anomaly.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`rounded-xl border-2 bg-gradient-to-br ${
                    anomaly.severity === 'high' ? 'from-error01 to-alert01 border-error03/30' :
                    anomaly.severity === 'medium' ? 'from-alert01 to-alert01 border-alert02/30' :
                    'from-neutral01 to-neutral01 border-neutral02/30'
                  } bg-white/90 backdrop-blur p-4 hover:shadow-xl transition-all`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-textLink/20 to-pinkTP/20 border border-textLink/30">
                      <AlertCircle className="w-4 h-4 text-textLink" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`text-xs px-2 py-1 rounded-md border ${
                        anomaly.severity === 'high' ? priorityColors.high :
                        anomaly.severity === 'medium' ? priorityColors.medium :
                        priorityColors.low
                      }`}>
                        {anomaly.severity}
                      </div>
                      <div className="text-xs font-bold px-2 py-1 rounded-md bg-white/60 text-text01 border border-stroke01">
                        {Math.round(anomaly.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-text01 leading-tight mb-2">
                    {anomaly.title}
                  </div>
                  <div className="text-xs text-text03 leading-relaxed mb-3">
                    {anomaly.description}
                  </div>
                  <div className="pt-2 border-t border-stroke01">
                    <div className="text-xs font-medium text-primary">
                      → {anomaly.recommendation}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text03">
              No anomalies detected
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-stroke01 my-6" />

        {/* Section 1: Actionable Items */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-error01 to-alert01 border border-error03/30">
              <AlertTriangle className="w-4 h-4 text-error02" />
            </div>
            <h3 className="text-lg font-semibold text-text01">Action Required</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-error01 text-error02 font-medium">
              {actionableItems.length} items
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actionableItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => handleActionClick(item)}
                  className={`rounded-xl border-2 bg-gradient-to-br ${typeColors[item.type] || "from-bg02 to-bg02 border-stroke01"} bg-white/90 backdrop-blur p-4 hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer relative`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${typeColors[item.type] || ""} border border-current/20`}>
                      <Icon className={`w-4 h-4 ${iconColors[item.type] || "text-text03"}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Priority badge */}
                      {item.priority && (
                        <div className={`text-xs px-2 py-1 rounded-md border ${priorityColors[item.priority]}`}>
                          {item.priority}
                        </div>
                      )}
                      <div className="text-xs font-bold px-2 py-1 rounded-md bg-white/60 text-text01 border border-stroke01">
                        {item.metric}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-text01 leading-tight mb-2">
                    {item.title}
                  </div>
                  <div className="text-xs text-text03 leading-relaxed mb-3">
                    {item.detail}
                  </div>
                  {/* Action button */}
                  {item.action && (
                    <div className="pt-2 border-t border-stroke01">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(item);
                        }}
                        className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        → {item.action}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-stroke01 my-6" />

        {/* Section 2: Informational Insights */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-neutral01 to-neutral01 border border-neutral02/30">
              <Brain className="w-4 h-4 text-neutral02" />
            </div>
            <h3 className="text-lg font-semibold text-text01">Insights & Metrics</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-neutral01 text-neutral02 font-medium">
              {informationalInsights.length} insights
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {informationalInsights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className={`rounded-xl border-2 bg-gradient-to-br ${typeColors[item.type] || "from-bg02 to-bg02 border-stroke01"} bg-white/90 backdrop-blur p-4 hover:shadow-lg transition-all`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${item.gradient ? `bg-gradient-to-br ${item.gradient} text-white shadow` : `bg-gradient-to-br ${typeColors[item.type] || ""} border border-current/20`}`}>
                      <Icon className={`w-4 h-4 ${item.gradient ? "text-white" : (iconColors[item.type] || "text-text03")}`} />
                    </div>
                    {item.delta && (
                      <div className="text-xs font-medium text-success03">
                        {item.delta}
                      </div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-text01 mb-1">
                    {item.metric}
                  </div>
                  <div className="text-sm font-medium text-text01 mb-2">
                    {item.title}
                  </div>
                  <div className="text-xs text-text03 leading-relaxed">
                    {item.detail}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-bg01 rounded-lg border border-stroke01 p-6">
        <h3 className="text-lg font-semibold text-text01 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate?.("worklist")}
            className="p-4 rounded-lg border-2 border-stroke01 hover:border-primary hover:bg-hover transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <FileCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="font-semibold text-text01">View Worklist</div>
            </div>
            <p className="text-sm text-text03">Access all claims and start processing</p>
          </button>

          <button
            onClick={() => onNavigate?.("reports")}
            className="p-4 rounded-lg border-2 border-stroke01 hover:border-primary hover:bg-hover transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <TrendingUpIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="font-semibold text-text01">View Reports</div>
            </div>
            <p className="text-sm text-text03">Analyze trends and performance metrics</p>
          </button>

          <button
            onClick={() => onNavigate?.("knowledge")}
            className="p-4 rounded-lg border-2 border-stroke01 hover:border-primary hover:bg-hover transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div className="font-semibold text-text01">Knowledge Base</div>
            </div>
            <p className="text-sm text-text03">Browse SOPs and documentation</p>
          </button>
        </div>
      </div>
    </div>
  );
}


import React, { useState, useMemo, useEffect } from"react";
import { motion } from"framer-motion";
import {
 TrendingUp,
 TrendingDown,
 DollarSign,
 Clock,
 Target,
 AlertTriangle,
 Brain,
 Zap,
 BarChart3,
 PieChart,
 Activity,
 ArrowUpRight,
 ArrowDownRight,
 CheckCircle2,
 XCircle,
 FileText,
 Store,
 Users,
 Timer,
 Shield,
} from"lucide-react";
import { getTicketStats } from"../services/ticketsService";

/**
 * Executive Dashboard for TP FAB Agents
 * C-level focused view with ROI metrics, automation impact, and business intelligence
 * Author: Vinod Kumar V (VKV)
 */

// Get executive metrics from ticket stats
const getExecutiveMetrics = (stats) => {
 const total = stats.total || 1;
 const selfHealed = stats.selfHealed || 0;
 const escalated = stats.escalated || 0;
 
 // Calculate cost savings (assuming $50 per ticket avoided, $25 per self-healed)
 const costPerTicket = 50;
 const costPerSelfHeal = 25;
 const costSavings = (selfHealed * costPerSelfHeal) + ((total - escalated) * costPerTicket);
 
 // Calculate time savings (assuming 15 min per ticket, 2 min per self-heal)
 const timePerTicket = 15; // minutes
 const timePerSelfHeal = 2; // minutes
 const timeSaved = (selfHealed * timePerSelfHeal) + ((total - escalated) * timePerTicket);
 
 // Calculate automation rate
 const automationRate = total > 0 ? Math.round((selfHealed / total) * 100) : 0;
 
 // Calculate efficiency gain (productivity increase)
 const efficiencyGain = automationRate > 0 ? Math.round(automationRate * 0.8) : 0;
 
 return {
  costSavings: {
   current: costSavings,
   previous: costSavings * 0.85, // Simulated previous period
   trend:"+18%",
   source:"Automated resolution and ticket prevention",
  },
  timeSaved: {
   current: timeSaved,
   previous: timeSaved * 0.88,
   trend:"+12%",
   hours: Math.round(timeSaved / 60),
   minutes: timeSaved % 60,
  },
  automationRate: {
   current: automationRate,
   previous: automationRate - 5,
   trend: `+${automationRate - (automationRate - 5)}%`,
   target: 75,
  },
  efficiencyGain: {
   current: efficiencyGain,
   previous: efficiencyGain - 3,
   trend:"+3%",
   metric: `${automationRate}% automated vs ${automationRate - 5}% baseline`,
  },
  customerSatisfaction: {
   current: 94,
   previous: 88,
   trend:"+6%",
  },
  resolutionSpeed: {
   current: 45, // seconds
   previous: 1080, // 18 minutes
   trend:"-96%",
   improvement:"From 18 min to 45 sec",
  },
  roi: {
   investment: 100000, // $100K
   return: costSavings,
   ratio: (costSavings / 100000).toFixed(1),
  },
 };
};

// Mock predictive insights
const getPredictiveInsights = (stats) => [
 {
  id: 1,
  type:"automation",
  title: `${stats.selfHealed || 0} tickets self-healed this month`,
  confidence: 95,
  impact: `$${((stats.selfHealed || 0) * 25).toLocaleString()} saved`,
  action:"View details",
  priority:"high",
 },
 {
  id: 2,
  type:"escalation",
  title: `${stats.escalated || 0} tickets escalated to human agents`,
  confidence: 92,
  impact:"Requires review",
  action:"Review patterns",
  priority:"medium",
 },
 {
  id: 3,
  type:"workflow",
  title:"Top workflow: Printer Offline",
  confidence: 87,
  impact: `${stats.byWorkflow?.["printer_offline"] || 0} incidents`,
  action:"Optimize workflow",
  priority:"medium",
 },
];

const fadeUp = {
 hidden: { opacity: 0, y: 20 },
 show: {
  opacity: 1,
  y: 0,
  transition: { duration: 0.5, ease:"easeOut" },
 },
};

export default function ExecutiveDashboard({ onNavigate }) {
 const [selectedTimeframe, setSelectedTimeframe] = useState("month");
 const [stats, setStats] = useState({
  total: 0,
  selfHealed: 0,
  escalated: 0,
  inProgress: 0,
  failed: 0,
  bySystem: {},
  byWorkflow: {},
 });

 // Load stats
 useEffect(() => {
  const loadStats = () => {
   const ticketStats = getTicketStats();
   setStats(ticketStats);
  };
  
  loadStats();
  const interval = setInterval(loadStats, 30000); // Refresh every 30 seconds
  return () => clearInterval(interval);
 }, []);

 const metrics = useMemo(() => getExecutiveMetrics(stats), [stats]);
 const insights = useMemo(() => getPredictiveInsights(stats), [stats]);

 return (
  <div className="space-y-6 pb-6 px-6 pt-6">
   {/* Header */}
   <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="show"
    className="mb-6"
   >
    <div className="flex items-center justify-between">
     <div className="flex-1">
      <h1 className="text-lg font-bold text-text01 mb-2">
       Executive Dashboard
      </h1>
      <p className="text-sm text-text02 mt-1">
       Real-time ROI metrics, automation impact, and business intelligence
      </p>
     </div>
     {onNavigate && (
      <button
       onClick={() => onNavigate("store")}
       className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text02 hover:text-pinkTP:text-pinkTP rounded-lg hover:bg-bg03:bg-text01 transition-colors"
       title="Back to FAB Store"
      >
       <Store className="w-3.5 h-3.5" />
       <span className="hidden sm:inline">Store</span>
      </button>
     )}
     <div className="flex items-center gap-2">
      <select
       value={selectedTimeframe}
       onChange={(e) => setSelectedTimeframe(e.target.value)}
       className="px-3 py-1.5 rounded-lg border border-stroke01 bg-white text-sm text-text01 focus:outline-none focus:ring-2 focus:ring-pinkTP"
      >
       <option value="week">This Week</option>
       <option value="month">This Month</option>
       <option value="quarter">This Quarter</option>
       <option value="year">This Year</option>
      </select>
     </div>
    </div>
   </motion.div>

   {/* Tier 1: ROI Metrics - Large Prominent Cards */}
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {/* Cost Savings */}
    <motion.div
     variants={fadeUp}
     initial="hidden"
     animate="show"
     custom={0}
     className="bg-gradient-to-br from-success01 to-success01 rounded-xl border-2 border-success01 p-6 shadow-lg"
    >
     <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-lg bg-gradient-to-br from-success010 to-success010 shadow-md">
       <DollarSign className="w-6 h-6 text-white" />
      </div>
      <div className="flex items-center gap-1 text-success03">
       <ArrowUpRight className="w-4 h-4" />
       <span className="text-sm font-bold">{metrics.costSavings.trend}</span>
      </div>
     </div>
     <div className="mb-2">
      <p className="text-xs text-text02 mb-1">Cost Savings</p>
      <p className="text-2xl font-bold text-text01">
       ${(metrics.costSavings.current / 1000).toFixed(0)}K
      </p>
     </div>
     <div className="pt-3 border-t border-success01">
      <p className="text-xs text-text02">
       {metrics.costSavings.source}
      </p>
     </div>
    </motion.div>

    {/* Time Saved */}
    <motion.div
     variants={fadeUp}
     initial="hidden"
     animate="show"
     custom={1}
     className="bg-gradient-to-br from-neutral01 to-neutral01 rounded-xl border-2 border-neutral01 p-6 shadow-lg"
    >
     <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-lg bg-gradient-to-br from-neutral010 to-neutral010 shadow-md">
       <Clock className="w-6 h-6 text-white" />
      </div>
      <div className="flex items-center gap-1 text-neutral02">
       <ArrowUpRight className="w-4 h-4" />
       <span className="text-sm font-bold">{metrics.timeSaved.trend}</span>
      </div>
     </div>
     <div className="mb-2">
      <p className="text-xs text-text02 mb-1">Time Saved</p>
      <p className="text-2xl font-bold text-text01">
       {metrics.timeSaved.hours}h
      </p>
     </div>
     <div className="pt-3 border-t border-neutral01">
      <p className="text-xs text-text02">
       {metrics.timeSaved.minutes} minutes this month
      </p>
     </div>
    </motion.div>

    {/* Automation Rate */}
    <motion.div
     variants={fadeUp}
     initial="hidden"
     animate="show"
     custom={2}
     className="bg-gradient-to-br from-pinkTP/10 to-pinkTP/10 rounded-xl border-2 border-pinkTP/40 p-6 shadow-lg"
    >
     <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-lg bg-gradient-to-br from-pinkTP/100 to-pinkTP/100 shadow-md">
       <Zap className="w-6 h-6 text-white" />
      </div>
      <div className="flex items-center gap-1 text-pinkTP">
       <ArrowUpRight className="w-4 h-4" />
       <span className="text-sm font-bold">{metrics.automationRate.trend}</span>
      </div>
     </div>
     <div className="mb-2">
      <p className="text-xs text-text02 mb-1">Automation Rate</p>
      <p className="text-2xl font-bold text-text01">
       {metrics.automationRate.current}%
      </p>
     </div>
     <div className="pt-3 border-t border-pinkTP/40">
      <div className="flex items-center justify-between text-xs">
       <span className="text-text02">Target</span>
       <span className="font-semibold text-text01">
        {metrics.automationRate.target}%
       </span>
      </div>
      <div className="mt-2 h-2 bg-pinkTP/20 rounded-full overflow-hidden">
       <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(metrics.automationRate.current / metrics.automationRate.target) * 100}%` }}
        transition={{ duration: 1, delay: 0.3 }}
        className="h-full bg-gradient-to-r from-pinkTP/100 to-pinkTP/100 rounded-full"
       />
      </div>
     </div>
    </motion.div>

    {/* ROI Ratio */}
    <motion.div
     variants={fadeUp}
     initial="hidden"
     animate="show"
     custom={3}
     className="bg-gradient-to-br from-alert01 to-alert01 rounded-xl border-2 border-alert01 p-6 shadow-lg"
    >
     <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-lg bg-gradient-to-br from-alert010 to-alert010 shadow-md">
       <Target className="w-6 h-6 text-white" />
      </div>
      <div className="flex items-center gap-1 text-alert02">
       <ArrowUpRight className="w-4 h-4" />
       <span className="text-sm font-bold">{metrics.roi.ratio}x</span>
      </div>
     </div>
     <div className="mb-2">
      <p className="text-xs text-text02 mb-1">ROI Ratio</p>
      <p className="text-2xl font-bold text-text01">
       {metrics.roi.ratio}x
      </p>
     </div>
     <div className="pt-3 border-t border-alert01">
      <p className="text-xs text-text02">
       ${(metrics.roi.investment / 1000).toFixed(0)}K investment
      </p>
     </div>
    </motion.div>
   </div>

   {/* Tier 2: Performance Metrics */}
   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {/* Customer Satisfaction */}
    <motion.div
     variants={fadeUp}
     initial="hidden"
     animate="show"
     custom={4}
     className="bg-white rounded-xl border border-stroke01 p-6 shadow-sm"
    >
     <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-pinkTP/20">
       <Users className="w-5 h-5 text-pinkTP" />
      </div>
      <div className="flex-1">
       <p className="text-xs text-text02">Customer Satisfaction</p>
       <p className="text-2xl font-bold text-text01">
        {metrics.customerSatisfaction.current}%
       </p>
      </div>
      <div className="text-right">
       <div className="flex items-center gap-1 text-success03">
        <ArrowUpRight className="w-4 h-4" />
        <span className="text-xs font-bold">{metrics.customerSatisfaction.trend}</span>
       </div>
      </div>
     </div>
    </motion.div>

    {/* Resolution Speed */}
    <motion.div
     variants={fadeUp}
     initial="hidden"
     animate="show"
     custom={5}
     className="bg-white rounded-xl border border-stroke01 p-6 shadow-sm"
    >
     <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-neutral01">
       <Timer className="w-5 h-5 text-neutral02" />
      </div>
      <div className="flex-1">
       <p className="text-xs text-text02">Resolution Speed</p>
       <p className="text-2xl font-bold text-text01">
        {metrics.resolutionSpeed.current}s
       </p>
      </div>
      <div className="text-right">
       <div className="flex items-center gap-1 text-success03">
        <ArrowDownRight className="w-4 h-4" />
        <span className="text-xs font-bold">{metrics.resolutionSpeed.trend}</span>
       </div>
      </div>
     </div>
     <p className="text-xs text-text03">
      {metrics.resolutionSpeed.improvement}
     </p>
    </motion.div>

    {/* Efficiency Gain */}
    <motion.div
     variants={fadeUp}
     initial="hidden"
     animate="show"
     custom={6}
     className="bg-white rounded-xl border border-stroke01 p-6 shadow-sm"
    >
     <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-neutral01">
       <Activity className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
       <p className="text-xs text-text02">Efficiency Gain</p>
       <p className="text-2xl font-bold text-text01">
        {metrics.efficiencyGain.current}%
       </p>
      </div>
      <div className="text-right">
       <div className="flex items-center gap-1 text-success03">
        <ArrowUpRight className="w-4 h-4" />
        <span className="text-xs font-bold">{metrics.efficiencyGain.trend}</span>
       </div>
      </div>
     </div>
     <p className="text-xs text-text03">
      {metrics.efficiencyGain.metric}
     </p>
    </motion.div>
   </div>

   {/* Predictive Insights */}
   <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="show"
    custom={7}
    className="bg-white rounded-xl border border-stroke01 p-6 shadow-sm"
   >
    <div className="flex items-center gap-2 mb-4">
     <Brain className="w-5 h-5 text-pinkTP" />
     <h2 className="text-lg font-bold text-text01">Predictive Insights</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
     {insights.map((insight) => (
      <div
       key={insight.id}
       className={`p-4 rounded-lg border-2 ${
        insight.priority ==="high"
         ?"bg-error01 border-error01"
         : insight.priority ==="medium"
         ?"bg-alert01 border-alert01"
         :"bg-neutral01 border-neutral01"
       }`}
      >
       <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
         <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-bold text-text01">
           {insight.title}
          </h3>
          {insight.priority ==="high" && (
           <span className="px-2 py-0.5 rounded text-xs font-semibold bg-error01 text-error02">
            High
           </span>
          )}
         </div>
         <p className="text-xs text-text02 mb-2">
          {insight.impact}
         </p>
        </div>
        <div className="text-right">
         <div className="text-xs text-text03">
          {insight.confidence}% confidence
         </div>
        </div>
       </div>
      </div>
     ))}
    </div>
   </motion.div>
  </div>
 );
}


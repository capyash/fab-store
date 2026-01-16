/**
 * Agent Performance Card Component
 * Author: Vinod Kumar V (VKV)
 */

import { Bot, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const AGENT_DESCRIPTIONS = {
  intent_detection: "Classifies customer intents using multi-class LLM reasoning",
  diagnostic: "Performs workflow-specific diagnostics to identify root causes",
  action_execution: "Executes remediation actions based on diagnosis",
  verification: "Verifies if self-heal actions resolved the issue",
  escalation_decision: "Decides whether to escalate to human experts",
};

export default function AgentPerformanceCard({ agent, onClick }) {
  const successRate = agent.success_rate || 0;
  const getStatusColor = (rate) => {
    if (rate >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (rate >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };
  
  const getStatusIcon = (rate) => {
    if (rate >= 90) return CheckCircle2;
    if (rate >= 70) return AlertCircle;
    return XCircle;
  };
  
  const StatusIcon = getStatusIcon(successRate);
  const statusColor = getStatusColor(successRate);
  
  return (
    <div
      onClick={onClick}
      className="rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#780096]/10">
            <Bot className="w-5 h-5 text-[#780096]" />
          </div>
          <div>
            <div className="font-bold text-gray-900">
              {agent.agent_name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {AGENT_DESCRIPTIONS[agent.agent_name] || "AI Agent"}
            </div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
          <StatusIcon className="w-3 h-3 inline mr-1" />
          {successRate.toFixed(1)}%
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className="text-xs text-gray-500">Executions</div>
          <div className="text-lg font-bold text-gray-900">{agent.execution_count?.toLocaleString() || 0}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Avg Latency</div>
          <div className="text-lg font-bold text-gray-900">{agent.avg_latency_ms?.toFixed(0) || 0}ms</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Tokens</div>
          <div className="text-sm font-semibold text-gray-700">
            {(agent.total_tokens / 1000).toFixed(1)}K
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Cost</div>
          <div className="text-sm font-semibold text-gray-700">
            ${agent.total_cost_usd?.toFixed(2) || "0.00"}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            successRate >= 90 ? "bg-green-500" : successRate >= 70 ? "bg-yellow-500" : "bg-red-500"
          }`}
          style={{ width: `${successRate}%` }}
        />
      </div>
    </div>
  );
}

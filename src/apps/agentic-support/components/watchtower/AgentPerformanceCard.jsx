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
    if (rate >= 90) return "text-success03 bg-success01 border-success01";
    if (rate >= 70) return "text-alert02 bg-alert01 border-alert01";
    return "text-error03 bg-error01 border-error01";
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
      className="rounded-lg border border-stroke01 bg-white p-5 hover:border-stroke01 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-pinkTP/10">
            <Bot className="w-5 h-5 text-pinkTP" />
          </div>
          <div>
            <div className="font-bold text-text01">
              {agent.agent_name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </div>
            <div className="text-xs text-text03 mt-1">
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
          <div className="text-xs text-text03">Executions</div>
          <div className="text-lg font-bold text-text01">{agent.execution_count?.toLocaleString() || 0}</div>
        </div>
        <div>
          <div className="text-xs text-text03">Avg Latency</div>
          <div className="text-lg font-bold text-text01">{agent.avg_latency_ms?.toFixed(0) || 0}ms</div>
        </div>
        <div>
          <div className="text-xs text-text03">Tokens</div>
          <div className="text-sm font-semibold text-text01">
            {(agent.total_tokens / 1000).toFixed(1)}K
          </div>
        </div>
        <div>
          <div className="text-xs text-text03">Cost</div>
          <div className="text-sm font-semibold text-text01">
            ${agent.total_cost_usd?.toFixed(2) || "0.00"}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-stroke01 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            successRate >= 90 ? "bg-success010" : successRate >= 70 ? "bg-alert010" : "bg-error010"
          }`}
          style={{ width: `${successRate}%` }}
        />
      </div>
    </div>
  );
}

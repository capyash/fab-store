/**
 * Collaboration Flow Diagram Component
 * Shows agent handoffs and collaboration patterns
 * Author: Vinod Kumar V (VKV)
 */

import { Bot, ArrowRight, User, CheckCircle2 } from "lucide-react";

const AGENT_NAMES = {
  intent_detection: "Intent Detection",
  diagnostic: "Diagnostic",
  action_execution: "Action",
  verification: "Verification",
  escalation_decision: "Escalation",
};

export default function CollaborationFlow({ agents }) {
  // Calculate handoff volumes between agents
  const getHandoffVolume = (fromAgent, toAgent) => {
    // Mock calculation - in production, this would come from actual workflow data
    const fromExecutions = agents.find(a => a.agent_name === fromAgent)?.execution_count || 0;
    const toExecutions = agents.find(a => a.agent_name === toAgent)?.execution_count || 0;
    return Math.min(fromExecutions, toExecutions);
  };

  const agentFlow = [
    { id: "intent_detection", name: "Intent Detection", x: 0, y: 0 },
    { id: "diagnostic", name: "Diagnostic", x: 200, y: 0 },
    { id: "action_execution", name: "Action", x: 400, y: 0 },
    { id: "verification", name: "Verification", x: 600, y: 0 },
    { id: "escalation_decision", name: "Escalation", x: 800, y: 0 },
  ];

  const handoffs = [
    { from: "intent_detection", to: "diagnostic", volume: getHandoffVolume("intent_detection", "diagnostic") },
    { from: "diagnostic", to: "action_execution", volume: getHandoffVolume("diagnostic", "action_execution") },
    { from: "action_execution", to: "verification", volume: getHandoffVolume("action_execution", "verification") },
    { from: "verification", to: "escalation_decision", volume: getHandoffVolume("verification", "escalation_decision") },
  ];

  // Human handoff point
  const humanHandoff = agents.find(a => a.agent_name === "escalation_decision");
  const escalatedVolume = Math.floor((humanHandoff?.execution_count || 0) * 0.2); // 20% escalation rate

  return (
    <div className="p-6">
      <div className="text-sm text-text02 mb-6">Agent Collaboration Flow</div>
      
      <div className="relative overflow-x-auto" style={{ height: "400px", minWidth: "900px" }}>
        {/* Agent Nodes */}
        {agentFlow.map((agent, idx) => {
          const agentData = agents.find(a => a.agent_name === agent.id);
          const successRate = agentData?.success_rate || 0;
          const isHealthy = successRate >= 90;
          
          return (
            <div
              key={agent.id}
              className="absolute"
              style={{ left: `${agent.x}px`, top: `${agent.y}px` }}
            >
              <div className={`flex flex-col items-center ${idx === agentFlow.length - 1 ? 'mb-16' : ''}`}>
                <div
                  className={`w-24 h-24 rounded-lg border-2 flex flex-col items-center justify-center ${
                    isHealthy
                      ? "bg-success01 border-success01"
                      : successRate >= 70
                      ? "bg-alert01 border-alert01"
                      : "bg-error01 border-error01"
                  }`}
                >
                  <Bot className={`w-6 h-6 ${
                    isHealthy ? "text-success03" : successRate >= 70 ? "text-alert02" : "text-error03"
                  }`} />
                  <div className="text-xs font-semibold text-text01 mt-1 text-center px-1">
                    {agent.name}
                  </div>
                </div>
                <div className="mt-2 text-xs text-text03">
                  {agentData?.execution_count?.toLocaleString() || 0} exec
                </div>
                <div className={`text-xs font-semibold ${
                  isHealthy ? "text-success03" : successRate >= 70 ? "text-alert02" : "text-error03"
                }`}>
                  {successRate.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}

        {/* Handoff Arrows */}
        {handoffs.map((handoff, idx) => {
          const fromAgent = agentFlow.find(a => a.id === handoff.from);
          const toAgent = agentFlow.find(a => a.id === handoff.to);
          const volume = handoff.volume;
          
          return (
            <div
              key={`${handoff.from}-${handoff.to}`}
              className="absolute"
              style={{
                left: `${fromAgent.x + 96}px`,
                top: `${fromAgent.y + 48}px`,
                width: `${toAgent.x - fromAgent.x - 96}px`,
              }}
            >
              <div className="relative h-full flex items-center">
                <ArrowRight className="w-5 h-5 text-text03 absolute" />
                <div className="absolute right-0 -top-6 text-xs text-text03 bg-white px-1">
                  {volume.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}

        {/* Human Handoff */}
        <div
          className="absolute"
          style={{ left: "800px", top: "120px" }}
        >
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-lg border-2 border-pinkTP/40 bg-pinkTP/10 flex flex-col items-center justify-center">
              <User className="w-6 h-6 text-pinkTP" />
              <div className="text-xs font-semibold text-text01 mt-1">Human</div>
            </div>
            <div className="mt-2 text-xs text-text03">
              {escalatedVolume.toLocaleString()} escalated
            </div>
          </div>
        </div>

        {/* Escalation Arrow */}
        <div
          className="absolute"
          style={{
            left: "824px",
            top: "96px",
            width: "0px",
            height: "24px",
          }}
        >
          <div className="relative h-full flex items-center">
            <ArrowRight className="w-4 h-4 text-purple-400 transform rotate-90" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-success01 border border-success03" />
          <span className="text-text02">Healthy (&gt;90%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-alert01 border border-alert02" />
          <span className="text-text02">Warning (70-90%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-error01 border border-error03" />
          <span className="text-text02">Critical (&lt;70%)</span>
        </div>
      </div>
    </div>
  );
}

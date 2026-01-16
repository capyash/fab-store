/**
 * Collaboration Panel Component
 * Author: Vinod Kumar V (VKV)
 */

import { Bot, ArrowRight, User, Zap } from "lucide-react";

const PANEL_CONFIGS = {
  autonomous: {
    title: "Autonomous Agent Chain",
    description: "AI agents collaborating without human intervention",
    icon: Bot,
    gradient: "from-green-500 to-emerald-600",
    borderColor: "border-green-300",
  },
  ai_to_human: {
    title: "AI-to-Human Handoff",
    description: "AI agents escalating to human experts",
    icon: ArrowRight,
    gradient: "from-purple-500 to-pink-600",
    borderColor: "border-purple-300",
  },
  human_to_ai: {
    title: "Human-Initiated AI Assist",
    description: "Humans delegating tasks to AI agents",
    icon: User,
    gradient: "from-blue-500 to-indigo-600",
    borderColor: "border-blue-300",
  },
};

export default function CollaborationPanel({ type, data }) {
  const config = PANEL_CONFIGS[type] || PANEL_CONFIGS.autonomous;
  const Icon = config.icon;
  
  return (
    <div className={`rounded-lg border ${config.borderColor} bg-white p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient} text-white`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-gray-900">{config.title}</div>
          <div className="text-xs text-gray-500">{config.description}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Volume</div>
          <div className="text-2xl font-bold text-gray-900">{data.volume?.toLocaleString() || 0}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">
            {type === "autonomous" ? "Success Rate" : type === "ai_to_human" ? "Handoff Rate" : "Delegation Rate"}
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {data.success_rate || data.handoff_rate || data.delegation_rate || 0}%
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">
            {type === "autonomous" ? "Avg Latency" : type === "ai_to_human" ? "Handoff Time" : "Time Saved"}
          </div>
          <div className="text-lg font-semibold text-gray-700">
            {type === "autonomous" 
              ? `${(data.avg_latency_ms / 1000).toFixed(1)}s`
              : type === "ai_to_human"
              ? `${data.avg_handoff_time_seconds?.toFixed(1)}s`
              : `${data.time_saved_minutes?.toFixed(1)} min`}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">
            {type === "autonomous" ? "Cost/Resolution" : type === "ai_to_human" ? "Human Resolution" : "AI Success"}
          </div>
          <div className="text-lg font-semibold text-gray-700">
            {type === "autonomous"
              ? `$${data.cost_per_resolution_usd?.toFixed(2) || "0.00"}`
              : type === "ai_to_human"
              ? `${data.human_resolution_rate?.toFixed(0) || 0}%`
              : `${data.ai_success_rate?.toFixed(0) || 0}%`}
          </div>
        </div>
      </div>
    </div>
  );
}

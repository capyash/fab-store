/**
 * Reasoning Card - Platform-Agnostic
 * 
 * Displays a single reasoning step from AI agents
 */

import { motion } from "framer-motion";
import { Brain, CheckCircle2, AlertCircle, Info } from "lucide-react";

export default function ReasoningCard({ step, agentNames, onReferenceView }) {
  const getAgentIcon = (agentName) => {
    const name = (agentName || "").toLowerCase();
    if (name.includes("risk") || name.includes("assess")) return AlertCircle;
    if (name.includes("match") || name.includes("resource")) return CheckCircle2;
    if (name.includes("analyze") || name.includes("analysis")) return Brain;
    return Info;
  };

  const getAgentColor = (agentName) => {
    const name = (agentName || "").toLowerCase();
    if (name.includes("risk")) return "text-error03 bg-error01 border-error01";
    if (name.includes("match")) return "text-neutral02 bg-neutral01 border-neutral01";
    if (name.includes("analyze")) return "text-pinkTP bg-pinkTP/10 border-pinkTP/40";
    return "text-text02 bg-bg02 border-stroke01";
  };

  const AgentIcon = getAgentIcon(step.agent);
  const colorClass = getAgentColor(step.agent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border bg-white shadow-sm p-4"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <AgentIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-text01 text-sm">
              {step.agent || agentNames?.analyzer || "Analysis"}
            </h4>
            {step.confidence && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-bg03 text-text01">
                {Math.round(step.confidence * 100)}%
              </span>
            )}
          </div>
          <p className="text-sm text-text01 mb-2">{step.text || step.result || step.details}</p>
          {step.references && step.references.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {step.references.map((ref, idx) => (
                <button
                  key={idx}
                  onClick={() => onReferenceView?.(ref.id, ref.type)}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-neutral01 text-textLink hover:bg-neutral02/40 transition-colors"
                >
                  {ref.label || ref.id}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}


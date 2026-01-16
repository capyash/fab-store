/**
 * Reasoning Summary Card - Platform-Agnostic
 * 
 * Displays the final recommendation with action buttons
 */

import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, XCircle, FileText, AlertCircle } from "lucide-react";

export default function ReasoningSummaryCard({ 
  recommendation, 
  item, 
  itemLabel = "item",
  onAction,
  onReferenceView,
}) {
  const getActionButtons = () => {
    if (!recommendation?.actions) return [];

    return recommendation.actions.map((action) => {
      const icons = {
        approve: CheckCircle2,
        deny: XCircle,
        schedule: FileText,
        escalate: AlertCircle,
      };
      const Icon = icons[action.type] || FileText;

      return (
        <button
          key={action.type}
          onClick={() => onAction?.(action.type, recommendation)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            action.type === "approve"
              ? "bg-success01 text-success02 hover:bg-success01"
              : action.type === "deny"
              ? "bg-error01 text-error02 hover:bg-error01"
              : "bg-bg03 text-text01 hover:bg-stroke01"
          }`}
        >
          <Icon className="w-4 h-4 inline mr-2" />
          {action.label}
        </button>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border-2 border-neutral02/40 bg-gradient-to-br from-neutral01 to-pinkTP/10 shadow-lg p-6"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-pinkTP to-pinkTP">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-text01 mb-2">Recommendation</h3>
          <p className="text-text01 leading-relaxed">
            {recommendation.text || recommendation.recommendation || "No recommendation available"}
          </p>
        </div>
        {recommendation.confidence && (
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white text-textLink border border-neutral02/40">
            {Math.round(recommendation.confidence * 100)}% confidence
          </span>
        )}
      </div>

      {/* References */}
      {recommendation.references && recommendation.references.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-text02" />
            <span className="text-xs font-semibold text-text01 uppercase">References</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendation.references.map((ref, idx) => (
              <button
                key={idx}
                onClick={() => onReferenceView?.(ref.id, ref.type)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white text-textLink border border-neutral02/40 hover:bg-neutral01 transition-colors"
              >
                {ref.label || ref.id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {recommendation.actions && recommendation.actions.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral02/40">
          {getActionButtons()}
        </div>
      )}
    </motion.div>
  );
}


import React from "react";
import { ArrowLeft, Store } from "lucide-react";
import CasesTable from "./CasesTable";

/**
 * Worklist Component for TP Resolve
 * Main cases processing area with full table, filtering, and actions
 */
export default function Worklist({ onSelectCase, onNavigate }) {
  return (
    <div className="p-6">
      {/* Header with Back to Store button */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Cases Worklist
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and process appeals & grievances. Click on a case to analyze with AI reasoning.
            </p>
          </div>
          
          {/* Back to Store Button */}
          {onNavigate && (
            <button
              onClick={() => onNavigate("store")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-[#780096] dark:hover:text-[#780096] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Back to FAB Store"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Store</span>
            </button>
          )}
        </div>
      </div>

      {/* Cases Table */}
      <CasesTable onSelect={onSelectCase} />
    </div>
  );
}


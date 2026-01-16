import React from"react";
import { Store } from"lucide-react";
import LoansTable from"./LoansTable";

/**
 * Worklist Component for TP Lend
 * Main loans processing area with full table, filtering, and actions
 */
export default function Worklist({ onSelectLoan, onNavigate }) {
 return (
  <div className="p-6">
   {/* Header with Back to Store button */}
   <div className="mb-6">
    <div className="flex items-center justify-between mb-4">
     <div className="flex-1">
      <h1 className="text-lg font-bold text-text01 mb-2">
       Loans Worklist
      </h1>
      <p className="text-text02">
       Manage and process mortgage applications. Click on a loan to analyze with AI reasoning.
      </p>
     </div>
     
     {/* Back to Store Button */}
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
    </div>
   </div>

   {/* Loans Table */}
   <LoansTable onSelect={onSelectLoan} />
  </div>
 );
}


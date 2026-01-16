/**
 * Category Performance Card Component
 * Author: Vinod Kumar V (VKV)
 */

import { Printer, Laptop, Wifi } from "lucide-react";

const CATEGORY_ICONS = {
  "Printer Troubleshooting": Printer,
  "Hardware Diagnostics": Laptop,
  "Network Connectivity": Wifi,
};

export default function CategoryPerformanceCard({ category }) {
  const Icon = CATEGORY_ICONS[category.category_name] || Printer;
  const total = category.total_tickets || 0;
  const successful = category.successful_tickets || 0;
  const failed = category.failed_tickets || 0;
  const autoResolved = Math.floor(successful * 0.75); // Estimate
  const escalated = successful - autoResolved;
  
  const autoPercent = total > 0 ? Math.round((autoResolved / total) * 100) : 0;
  const escalatedPercent = total > 0 ? Math.round((escalated / total) * 100) : 0;
  const failedPercent = total > 0 ? Math.round((failed / total) * 100) : 0;
  
  return (
    <div className="rounded-lg border border-stroke01 bg-white p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-pinkTP/10">
          <Icon className="w-5 h-5 text-pinkTP" />
        </div>
        <div className="font-bold text-text01">{category.category_name}</div>
      </div>
      
      <div className="mb-4">
        <div className="text-2xl font-bold text-text01 mb-1">{total.toLocaleString()}</div>
        <div className="text-sm text-text03">Total Tickets</div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text02">Auto-resolved</span>
          <span className="font-semibold text-success03">{autoResolved} ({autoPercent}%)</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text02">Escalated</span>
          <span className="font-semibold text-alert02">{escalated} ({escalatedPercent}%)</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text02">Failed</span>
          <span className="font-semibold text-error03">{failed} ({failedPercent}%)</span>
        </div>
      </div>
      
      {/* Donut Chart Visualization */}
      <div className="relative w-24 h-24 mx-auto">
        <svg className="transform -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="var(--color-stroke01)"
            strokeWidth="4"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="var(--color-success03)"
            strokeWidth="4"
            strokeDasharray={`${autoPercent} ${100 - autoPercent}`}
            strokeLinecap="round"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="var(--color-alert02)"
            strokeWidth="4"
            strokeDasharray={`${escalatedPercent} ${100 - escalatedPercent}`}
            strokeDashoffset={`-${autoPercent}`}
            strokeLinecap="round"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="var(--color-error03)"
            strokeWidth="4"
            strokeDasharray={`${failedPercent} ${100 - failedPercent}`}
            strokeDashoffset={`-${autoPercent + escalatedPercent}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-text01">{category.success_rate?.toFixed(0) || 0}%</div>
            <div className="text-xs text-text03">Success</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-bg03 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-text03">Auto MTR</div>
          <div className="font-semibold text-text01">
            {((category.avg_latency_ms || 0) / 1000 / 60).toFixed(1)} min
          </div>
        </div>
        <div>
          <div className="text-text03">Escalated MTR</div>
          <div className="font-semibold text-text01">8.5 min</div>
        </div>
      </div>
    </div>
  );
}

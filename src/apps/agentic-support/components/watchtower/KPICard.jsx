/**
 * KPI Card Component with Sparkline
 * Author: Vinod Kumar V (VKV)
 */

import { CheckCircle2, Clock, DollarSign } from "lucide-react";

const KPI_ICONS = {
  self_heal: CheckCircle2,
  resolution_time: Clock,
  cost_efficiency: DollarSign,
};

const KPI_COLORS = {
  self_heal: "text-green-600 bg-green-50",
  resolution_time: "text-blue-600 bg-blue-50",
  cost_efficiency: "text-gray-700 bg-gray-50",
};

export default function KPICard({ type, value, subtitle, trend }) {
  const Icon = KPI_ICONS[type] || CheckCircle2;
  const colorClass = KPI_COLORS[type] || "text-gray-700 bg-gray-50";
  
  // Generate mock sparkline data
  const sparklineData = Array.from({ length: 12 }, () => Math.random() * 100);
  const maxValue = Math.max(...sparklineData);
  const minValue = Math.min(...sparklineData);
  const range = maxValue - minValue || 1;
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className={`w-5 h-5 ${colorClass.split(' ')[0]}`} />
        </div>
        <div className="text-sm text-gray-600">{subtitle}</div>
      </div>
      
      <div className="text-3xl font-semibold text-gray-900 mb-2">{value}</div>
      
      {/* Mini Sparkline */}
      <div className="h-10 mt-4 flex items-end gap-0.5">
        {sparklineData.map((point, idx) => {
          const height = ((point - minValue) / range) * 100;
          return (
            <div
              key={idx}
              className="flex-1 bg-gray-300 rounded-t"
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}

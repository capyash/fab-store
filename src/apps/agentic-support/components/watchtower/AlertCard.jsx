/**
 * Alert Card Component
 * Author: Vinod Kumar V (VKV)
 */

import { Clock, TrendingUp, DollarSign, Activity, AlertTriangle } from "lucide-react";

const ALERT_ICONS = {
  performance: Clock,
  volume_spike: TrendingUp,
  cost: DollarSign,
  success_rate: Activity,
};

const ALERT_COLORS = {
  performance: "border-amber-200 bg-amber-50",
  volume_spike: "border-orange-200 bg-orange-50",
  cost: "border-red-200 bg-red-50",
  success_rate: "border-blue-200 bg-blue-50",
};

export default function AlertCard({ alert }) {
  const Icon = ALERT_ICONS[alert.type] || AlertTriangle;
  const colorClass = ALERT_COLORS[alert.type] || "border-gray-300 bg-gray-50";
  
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? "s" : ""} ago`;
  };
  
  return (
    <div className={`rounded-lg border ${colorClass} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          alert.type === "performance" ? "bg-yellow-100" :
          alert.type === "volume_spike" ? "bg-orange-100" :
          alert.type === "cost" ? "bg-red-100" :
          "bg-blue-100"
        }`}>
          <Icon className={`w-5 h-5 ${
            alert.type === "performance" ? "text-yellow-600" :
            alert.type === "volume_spike" ? "text-orange-600" :
            alert.type === "cost" ? "text-red-600" :
            "text-blue-600"
          }`} />
        </div>
        <div className="flex-1">
          <div className="font-bold text-gray-900 mb-1">{alert.title}</div>
          <div className="text-sm text-gray-600 mb-2">{alert.description}</div>
          <div className="text-xs text-gray-500">{getTimeAgo(alert.timestamp)}</div>
        </div>
        <button className="text-xs text-[#780096] hover:underline">View</button>
      </div>
    </div>
  );
}

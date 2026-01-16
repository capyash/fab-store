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
  performance: "border-alert01 bg-alert01",
  volume_spike: "border-alert01 bg-alert01",
  cost: "border-error01 bg-error01",
  success_rate: "border-neutral01 bg-neutral01",
};

export default function AlertCard({ alert }) {
  const Icon = ALERT_ICONS[alert.type] || AlertTriangle;
  const colorClass = ALERT_COLORS[alert.type] || "border-stroke01 bg-bg02";
  
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
          alert.type === "performance" ? "bg-alert01" :
          alert.type === "volume_spike" ? "bg-alert01" :
          alert.type === "cost" ? "bg-error01" :
          "bg-neutral01"
        }`}>
          <Icon className={`w-5 h-5 ${
            alert.type === "performance" ? "text-alert02" :
            alert.type === "volume_spike" ? "text-pinkTP" :
            alert.type === "cost" ? "text-error03" :
            "text-neutral02"
          }`} />
        </div>
        <div className="flex-1">
          <div className="font-bold text-text01 mb-1">{alert.title}</div>
          <div className="text-sm text-text02 mb-2">{alert.description}</div>
          <div className="text-xs text-text03">{getTimeAgo(alert.timestamp)}</div>
        </div>
        <button className="text-xs text-pinkTP hover:underline">View</button>
      </div>
    </div>
  );
}

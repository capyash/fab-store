/**
 * Date Range Selector Component
 * Author: Vinod Kumar V (VKV)
 */

import { Calendar } from "lucide-react";

export default function DateRangeSelector({ value, onChange }) {
  const options = [
    { value: "24h", label: "Last 24h" },
    { value: "7d", label: "Last 7d" },
    { value: "30d", label: "Last 30d" },
    { value: "90d", label: "Last 90d" },
    { value: "custom", label: "Custom" },
  ];
  
  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-text03" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 text-sm border border-stroke01 rounded-lg bg-white text-text01 focus:outline-none focus:ring-2 focus:ring-pinkTP focus:border-transparent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

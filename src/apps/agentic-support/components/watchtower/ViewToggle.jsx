/**
 * View Toggle Component
 * Author: Vinod Kumar V (VKV)
 */

export default function ViewToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 border border-gray-200">
      <button
        onClick={() => onChange("agent")}
        className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
          value === "agent"
            ? "bg-white text-[#780096] shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Agent Performance
      </button>
      <button
        onClick={() => onChange("category")}
        className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
          value === "category"
            ? "bg-white text-[#780096] shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Workflow Categories
      </button>
    </div>
  );
}

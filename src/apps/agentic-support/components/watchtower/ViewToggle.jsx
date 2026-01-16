/**
 * View Toggle Component
 * Author: Vinod Kumar V (VKV)
 */

export default function ViewToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-bg03 rounded-lg p-1 border border-stroke01">
      <button
        onClick={() => onChange("agent")}
        className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
          value === "agent"
            ? "bg-white text-pinkTP shadow-sm"
            : "text-text02 hover:text-text01"
        }`}
      >
        Agent Performance
      </button>
      <button
        onClick={() => onChange("category")}
        className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${
          value === "category"
            ? "bg-white text-pinkTP shadow-sm"
            : "text-text02 hover:text-text01"
        }`}
      >
        Workflow Categories
      </button>
    </div>
  );
}

import { Package, AlertTriangle, CheckCircle2, MapPin } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Inventory Card Component
 * Displays inventory item information with stock levels
 */
export default function InventoryCard({ item, onSelect }) {
  const getStockStatus = (quantity, minThreshold) => {
    if (quantity === 0) return { color: "bg-error01 text-error02", label: "Out of Stock", icon: AlertTriangle };
    if (quantity <= minThreshold) return { color: "bg-alert01 text-amber-700", label: "Low Stock", icon: AlertTriangle };
    return { color: "bg-success01 text-success02", label: "In Stock", icon: CheckCircle2 };
  };

  const stockStatus = getStockStatus(item.quantity, item.minThreshold || 5);
  const StatusIcon = stockStatus.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-stroke01 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect?.(item)}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-text01">{item.partNumber || item.id}</h3>
            </div>
            <p className="text-sm text-text02">{item.name || item.description}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${stockStatus.color}`}>
            <StatusIcon className="w-4 h-4" />
            {stockStatus.label}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-text02">Quantity:</span>
            <span className={`font-semibold ${item.quantity === 0 ? "text-error03" : item.quantity <= (item.minThreshold || 5) ? "text-alert02" : "text-success03"}`}>
              {item.quantity} {item.unit || "units"}
            </span>
          </div>
          {item.location && (
            <div className="flex items-center gap-2 text-text02">
              <MapPin className="w-4 h-4 text-text03" />
              <span>{item.location}</span>
            </div>
          )}
          {item.category && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs bg-bg03 text-text01">
                {item.category}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}


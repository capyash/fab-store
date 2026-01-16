import { Clock, MapPin, User, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Work Order Card Component
 * Displays work order information in a card format
 */
export default function WorkOrderCard({ workOrder, onSelect, onAssign }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-success01 text-success02";
      case "in progress":
        return "bg-neutral01 text-neutral02";
      case "scheduled":
        return "bg-pinkTP/20 text-textLink";
      case "pending":
        return "bg-alert01 text-amber-700";
      case "cancelled":
        return "bg-error01 text-error02";
      default:
        return "bg-bg03 text-text01";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-error01 text-error02 border-error03";
      case "medium":
        return "bg-alert01 text-amber-700 border-alert02";
      case "low":
        return "bg-success01 text-success02 border-success03";
      default:
        return "bg-bg03 text-text01 border-stroke01";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-stroke01 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect?.(workOrder)}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-text01">{workOrder.id}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(workOrder.priority)} border`}>
                {workOrder.priority || "Medium"}
              </span>
            </div>
            <p className="text-sm text-text02">{workOrder.serviceType || "Service Request"}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(workOrder.status)}`}>
            {getStatusIcon(workOrder.status)}
            {workOrder.status || "Pending"}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          {workOrder.customer && (
            <div className="flex items-center gap-2 text-text02">
              <User className="w-4 h-4 text-text03" />
              <span>{workOrder.customer.name || workOrder.customer}</span>
            </div>
          )}
          {workOrder.location && (
            <div className="flex items-center gap-2 text-text02">
              <MapPin className="w-4 h-4 text-text03" />
              <span>{workOrder.location.address || workOrder.location}</span>
            </div>
          )}
          {workOrder.scheduledTime && (
            <div className="flex items-center gap-2 text-text02">
              <Clock className="w-4 h-4 text-text03" />
              <span>{new Date(workOrder.scheduledTime).toLocaleString()}</span>
            </div>
          )}
          {workOrder.slaHours !== undefined && (
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-4 h-4 ${workOrder.slaHours < 4 ? "text-error010" : workOrder.slaHours < 8 ? "text-alert010" : "text-success010"}`} />
              <span className={`text-sm font-medium ${workOrder.slaHours < 4 ? "text-error03" : workOrder.slaHours < 8 ? "text-alert02" : "text-success03"}`}>
                {workOrder.slaHours}h SLA remaining
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {onAssign && workOrder.status !== "completed" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAssign?.(workOrder);
            }}
            className="w-full mt-2 px-3 py-2 text-sm font-medium text-pinkTP bg-pinkTP/10 rounded-lg hover:bg-pinkTP/30 transition-colors"
          >
            Assign Technician
          </button>
        )}
      </div>
    </motion.div>
  );
}


import { Clock, AlertCircle, CheckCircle } from "lucide-react";

export default function DeadlineTracker({ deadline, daysUntilDeadline }) {
  if (!deadline || daysUntilDeadline === undefined) {
    return null;
  }

  const getUrgencyLevel = () => {
    if (daysUntilDeadline < 0) return "overdue";
    if (daysUntilDeadline < 7) return "urgent";
    if (daysUntilDeadline < 14) return "warning";
    return "normal";
  };

  const urgency = getUrgencyLevel();

  const getConfig = () => {
    switch (urgency) {
      case "overdue":
        return {
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-300 dark:border-red-700",
          textColor: "text-red-700 dark:text-red-300",
          icon: AlertCircle,
          iconColor: "text-red-600 dark:text-red-400",
          label: "Overdue",
        };
      case "urgent":
        return {
          bgColor: "bg-orange-50 dark:bg-orange-900/20",
          borderColor: "border-orange-300 dark:border-orange-700",
          textColor: "text-orange-700 dark:text-orange-300",
          icon: AlertCircle,
          iconColor: "text-orange-600 dark:text-orange-400",
          label: "Urgent",
        };
      case "warning":
        return {
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-300 dark:border-yellow-700",
          textColor: "text-yellow-700 dark:text-yellow-300",
          icon: Clock,
          iconColor: "text-yellow-600 dark:text-yellow-400",
          label: "Approaching",
        };
      default:
        return {
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-300 dark:border-green-700",
          textColor: "text-green-700 dark:text-green-300",
          icon: CheckCircle,
          iconColor: "text-green-600 dark:text-green-400",
          label: "On Track",
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const getDaysText = () => {
    if (daysUntilDeadline < 0) {
      return `${Math.abs(daysUntilDeadline)} day${Math.abs(daysUntilDeadline) === 1 ? '' : 's'} overdue`;
    }
    if (daysUntilDeadline === 0) return "Due today";
    if (daysUntilDeadline === 1) return "Due tomorrow";
    return `${daysUntilDeadline} day${daysUntilDeadline === 1 ? '' : 's'} remaining`;
  };

  return (
    <div className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${config.iconColor}`} />
        <span className={`text-sm font-semibold ${config.textColor}`}>
          {config.label}
        </span>
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        <div className="font-medium">{getDaysText()}</div>
        <div className="mt-1">Deadline: {new Date(deadline).toLocaleDateString()}</div>
      </div>
    </div>
  );
}


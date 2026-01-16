import { Clock, AlertCircle, CheckCircle } from"lucide-react";

export default function DeadlineTracker({ deadline, daysUntilDeadline }) {
 if (!deadline || daysUntilDeadline === undefined) {
  return null;
 }

 const getUrgencyLevel = () => {
  if (daysUntilDeadline < 0) return"overdue";
  if (daysUntilDeadline < 7) return"urgent";
  if (daysUntilDeadline < 14) return"warning";
  return"normal";
 };

 const urgency = getUrgencyLevel();

 const getConfig = () => {
  switch (urgency) {
   case"overdue":
    return {
     bgColor:"bg-error01",
     borderColor:"border-error03",
     textColor:"text-error02",
     icon: AlertCircle,
     iconColor:"text-error03",
     label:"Overdue",
    };
   case"urgent":
    return {
     bgColor:"bg-alert01",
     borderColor:"border-alert02",
     textColor:"text-orange-700",
     icon: AlertCircle,
     iconColor:"text-pinkTP",
     label:"Urgent",
    };
   case"warning":
    return {
     bgColor:"bg-alert01",
     borderColor:"border-alert02",
     textColor:"text-alert02",
     icon: Clock,
     iconColor:"text-alert02",
     label:"Approaching",
    };
   default:
    return {
     bgColor:"bg-success01",
     borderColor:"border-success03",
     textColor:"text-success02",
     icon: CheckCircle,
     iconColor:"text-success03",
     label:"On Track",
    };
  }
 };

 const config = getConfig();
 const Icon = config.icon;

 const getDaysText = () => {
  if (daysUntilDeadline < 0) {
   return `${Math.abs(daysUntilDeadline)} day${Math.abs(daysUntilDeadline) === 1 ? '' : 's'} overdue`;
  }
  if (daysUntilDeadline === 0) return"Due today";
  if (daysUntilDeadline === 1) return"Due tomorrow";
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
   <div className="text-xs text-text02">
    <div className="font-medium">{getDaysText()}</div>
    <div className="mt-1">Deadline: {new Date(deadline).toLocaleDateString()}</div>
   </div>
  </div>
 );
}


import { useState } from"react";
import { CheckCircle2, AlertCircle, Clock, XCircle, ChevronDown, ChevronUp, Activity } from"lucide-react";
import { motion, AnimatePresence } from"framer-motion";

/**
 * Transparency Log Component
 * Displays all actions performed with status indicators, API name, and execution time
 */
export default function TransparencyLog({ logEntries = [], className ="" }) {
 const [expanded, setExpanded] = useState(true);
 const [selectedEntry, setSelectedEntry] = useState(null);

 if (!logEntries || logEntries.length === 0) {
  return null;
 }

 const getStatusIcon = (status) => {
  switch (status) {
   case"success":
    return <CheckCircle2 className="w-4 h-4 text-success010" />;
   case"warning":
    return <AlertCircle className="w-4 h-4 text-alert010" />;
   case"error":
    return <XCircle className="w-4 h-4 text-error010" />;
   case"pending":
    return <Clock className="w-4 h-4 text-text03 animate-pulse" />;
   default:
    return <Activity className="w-4 h-4 text-text03" />;
  }
 };

 const getStatusColor = (status) => {
  switch (status) {
   case"success":
    return"bg-success01 border-success01";
   case"warning":
    return"bg-alert01 border-alert01";
   case"error":
    return"bg-error01 border-error01";
   case"pending":
    return"bg-bg02 border-stroke01";
   default:
    return"bg-bg02 border-stroke01";
  }
 };

 const formatTime = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
 };

 const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
   hour: '2-digit', 
   minute: '2-digit', 
   second: '2-digit',
   fractionalSecondDigits: 3 
  });
 };

 return (
  <div className={`bg-white rounded-lg border border-stroke01 ${className}`}>
   {/* Header */}
   <button
    onClick={() => setExpanded(!expanded)}
    className="w-full flex items-center justify-between px-4 py-3 border-b border-stroke01 hover:bg-bg02:bg-text01 transition-colors"
   >
    <div className="flex items-center gap-2">
     <Activity className="w-4 h-4 text-pinkTP" />
     <span className="font-semibold text-sm text-text01">
      Transparency Log
     </span>
     <span className="text-xs text-text03 bg-bg03 px-2 py-0.5 rounded">
      {logEntries.length} {logEntries.length === 1 ? 'entry' : 'entries'}
     </span>
    </div>
    {expanded ? (
     <ChevronUp className="w-4 h-4 text-text03" />
    ) : (
     <ChevronDown className="w-4 h-4 text-text03" />
    )}
   </button>

   {/* Log Entries */}
   <AnimatePresence>
    {expanded && (
     <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height:"auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
     >
      <div className="max-h-96 overflow-y-auto">
       <div className="divide-y divide-stroke01">
        {logEntries.map((entry, index) => (
         <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`p-3 border-l-4 ${getStatusColor(entry.status)} cursor-pointer hover:bg-bg02:bg-text01/50 transition-colors`}
          onClick={() => setSelectedEntry(selectedEntry === index ? null : index)}
         >
          <div className="flex items-start justify-between gap-3">
           <div className="flex items-start gap-2 flex-1">
            {getStatusIcon(entry.status)}
            <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm text-text01">
               {entry.action}
              </span>
              <span className="text-xs text-text03 bg-bg03 px-2 py-0.5 rounded">
               {entry.apiName}
              </span>
             </div>
             <div className="flex items-center gap-3 mt-1 text-xs text-text03">
              <span>{formatTime(entry.executionTime)}</span>
              <span>•</span>
              <span>{formatTimestamp(entry.timestamp)}</span>
             </div>
             {selectedEntry === index && entry.details && (
              <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height:"auto" }}
               exit={{ opacity: 0, height: 0 }}
               className="mt-2 p-2 bg-bg03 rounded text-xs"
              >
               <pre className="whitespace-pre-wrap text-text01">
                {JSON.stringify(entry.details, null, 2)}
               </pre>
              </motion.div>
             )}
            </div>
           </div>
          </div>
         </motion.div>
        ))}
       </div>
      </div>

      {/* Summary */}
      {logEntries.length > 0 && (
       <div className="px-4 py-3 bg-bg02 border-t border-stroke01">
        <div className="flex items-center justify-between text-xs text-text02">
         <span>
          Total execution time: {formatTime(
           logEntries.reduce((sum, entry) => sum + entry.executionTime, 0)
          )}
         </span>
         <span>
          {logEntries.filter(e => e.status ==="success").length} successful, {""}
          {logEntries.filter(e => e.status ==="warning").length} warnings, {""}
          {logEntries.filter(e => e.status ==="error").length} errors
         </span>
        </div>
       </div>
      )}
     </motion.div>
    )}
   </AnimatePresence>
  </div>
 );
}


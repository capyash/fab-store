/**
 * Reasoning Step Card
 * Displays individual reasoning steps in a collapsible, scannable format
 */

import { ChevronDown, ChevronUp, Sparkles, AlertCircle, CheckCircle2, Info } from"lucide-react";
import { motion, AnimatePresence } from"framer-motion";
import { useState } from"react";

export default function ReasoningStepCard({ step, index, onSOPView, claim }) {
 const [expanded, setExpanded] = useState(false);
 
 if (!step || step.role !=="ai-step") return null;

 // Extract key highlights from step text
 const extractHighlights = (text) => {
  if (!text) return [];
  
  const highlights = [];
  const sentences = text.split(/[.!?]\s+/);
  
  // Look for key phrases
  const keyPhrases = [
   /(?:confidence|confidence score)[:]\s*[\d.]+/i,
   /(?:key|important|critical|note)[:]\s*[^.!?]+/i,
   /(?:risk|issue|problem|missing|required)[:]\s*[^.!?]+/i,
  ];
  
  sentences.forEach(sentence => {
   if (keyPhrases.some(pattern => pattern.test(sentence))) {
    highlights.push(sentence.trim());
   }
  });
  
  // If no highlights found, use first 2-3 sentences
  if (highlights.length === 0 && sentences.length > 0) {
   highlights.push(...sentences.slice(0, 2).map(s => s.trim()));
  }
  
  return highlights.slice(0, 3);
 };

 // Get step icon based on agent type
 const getStepIcon = (agent) => {
  switch (agent?.toLowerCase()) {
   case"analysis":
    return Info;
   case"sop matcher":
    return Sparkles;
   case"risk assessor":
    return AlertCircle;
   default:
    return CheckCircle2;
  }
 };

 const highlights = extractHighlights(step.text);
 const confidence = step.confidence || 0;
 const StepIcon = getStepIcon(step.agent);
 const shortText = step.text?.substring(0, 150) ||"";
 const hasMore = step.text && step.text.length > 150;

 // Get confidence color
 const getConfidenceColor = (conf) => {
  if (conf >= 0.9) return"text-success03";
  if (conf >= 0.75) return"text-neutral02";
  if (conf >= 0.6) return"text-alert02";
  return"text-pinkTP";
 };

 const getConfidenceBg = (conf) => {
  if (conf >= 0.9) return"bg-success01";
  if (conf >= 0.75) return"bg-neutral01";
  if (conf >= 0.6) return"bg-alert01";
  return"bg-alert01";
 };

 return (
  <motion.div
   initial={{ opacity: 0, y: 10 }}
   animate={{ opacity: 1, y: 0 }}
   className="bg-white border border-stroke01 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
  >
   {/* Header - Always Visible */}
   <button
    onClick={() => setExpanded(!expanded)}
    className="w-full px-4 py-3 flex items-start justify-between gap-3 hover:bg-bg02:bg-text01 transition-colors text-left"
   >
    <div className="flex items-start gap-3 flex-1 min-w-0">
     {/* Step Icon */}
     <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${getConfidenceBg(confidence)}`}>
      <StepIcon className={`w-4 h-4 ${getConfidenceColor(confidence)}`} />
     </div>
     
     {/* Step Content */}
     <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
       <span className="text-sm font-semibold text-text01">
        {step.agent || `Step ${index + 1}`}
       </span>
       {confidence > 0 && (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getConfidenceBg(confidence)} ${getConfidenceColor(confidence)}`}>
         {Math.round(confidence * 100)}%
        </span>
       )}
      </div>
      
      {/* Short Preview */}
      <p className="text-sm text-text02 leading-relaxed">
       {expanded ? step.text : shortText}
       {!expanded && hasMore &&"..."}
      </p>
      
      {/* Key Highlights (when collapsed) */}
      {!expanded && highlights.length > 0 && (
       <div className="mt-2 space-y-1">
        {highlights.slice(0, 2).map((highlight, idx) => (
         <div key={idx} className="flex items-start gap-2 text-xs text-text03">
          <span className="text-pinkTP mt-0.5">•</span>
          <span>{highlight.substring(0, 80)}{highlight.length > 80 ?"..." :""}</span>
         </div>
        ))}
       </div>
      )}
     </div>
    </div>
    
    {/* Expand/Collapse Button */}
    <button
     onClick={(e) => {
      e.stopPropagation();
      setExpanded(!expanded);
     }}
     className="shrink-0 p-1 rounded hover:bg-stroke01:bg-text01 transition-colors"
    >
     {expanded ? (
      <ChevronUp className="w-4 h-4 text-text03" />
     ) : (
      <ChevronDown className="w-4 h-4 text-text03" />
     )}
    </button>
   </button>

   {/* Expanded Content */}
   <AnimatePresence>
    {expanded && (
     <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height:"auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden border-t border-stroke01"
     >
      <div className="px-4 py-3 bg-bg02 space-y-3">
       {/* Full Text */}
       <div className="text-sm text-text01 leading-relaxed whitespace-pre-wrap">
        {step.text}
       </div>
       
       {/* Details */}
       {step.details && (
        <div className="text-xs text-text03 italic bg-white rounded p-2 border border-stroke01">
         <span className="font-semibold">Details: </span>
         {step.details}
        </div>
       )}
       
       {/* SOP References */}
       {step.sopRefs && step.sopRefs.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stroke01">
         <span className="text-xs font-semibold text-text01">SOP References:</span>
         {step.sopRefs.map((ref, idx) => (
          <button
           key={idx}
           onClick={() => {
            if (ref.includes("Page") || ref.match(/^\d+$/)) {
             const pageNum = ref.replace("Page","").replace("page","");
             // Try to find matching SOP
             onSOPView?.(pageNum, null, claim?.status, null);
            } else {
             onSOPView?.(ref, null, claim?.status, null);
            }
           }}
           className="px-2 py-1 rounded text-xs font-medium bg-pinkTP/10 text-pinkTP/20 hover:bg-pinkTP/30:bg-pinkTP/30 transition-colors"
          >
           {ref}
          </button>
         ))}
        </div>
       )}
       
       {/* Confidence Bar */}
       {confidence > 0 && (
        <div className="pt-2">
         <div className="flex items-center justify-between text-xs text-text02 mb-1">
          <span>Confidence</span>
          <span className={`font-semibold ${getConfidenceColor(confidence)}`}>
           {Math.round(confidence * 100)}%
          </span>
         </div>
         <div className="h-1.5 bg-stroke01 rounded-full overflow-hidden">
          <motion.div
           initial={{ width: 0 }}
           animate={{ width: `${confidence * 100}%` }}
           transition={{ duration: 0.6 }}
           className={`h-full ${
            confidence >= 0.9 ?"bg-success010" :
            confidence >= 0.75 ?"bg-neutral010" :
            confidence >= 0.6 ?"bg-alert010" :
           "bg-alert010"
           }`}
          />
         </div>
        </div>
       )}
      </div>
     </motion.div>
    )}
   </AnimatePresence>
  </motion.div>
 );
}


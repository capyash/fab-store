/**
 * Reasoning Summary Card - Next Generation Design
 * Displays key information from AI analysis with modern UX patterns
 * Adapted for TP Lend (loans instead of claims)
 */

import { CheckCircle2, XCircle, AlertTriangle, Clock, FileText, ChevronDown, ChevronUp, Sparkles, Shield, Zap, TrendingUp, ArrowRight } from"lucide-react";
import { motion, AnimatePresence, useSpring, useTransform } from"framer-motion";
import { useState, useRef, useEffect } from"react";
import { SOP_INDEX, SCENARIO_SOPS } from"../data/sops";

export default function ReasoningSummaryCard({ recommendation, steps = [], loan, onSOPView, onAction }) {
 const [expanded, setExpanded] = useState(false);
 const [isHovered, setIsHovered] = useState(false);
 const cardRef = useRef(null);
 
 if (!recommendation) return null;

 // Extract action from recommendation text
 const getActionType = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("deny") || lowerText.includes("reject")) return"deny";
  if (lowerText.includes("approve") || lowerText.includes("process")) return"approve";
  if (lowerText.includes("request") || lowerText.includes("need") || lowerText.includes("missing")) return"request";
  return"review";
 };

 // Extract key information from steps and recommendation
 const extractKeyInfo = () => {
  const info = {
   risks: [],
   issues: [],
   highlights: [],
   nextSteps: [],
  };

  steps.forEach(step => {
   if (step.text) {
    // Extract risk factors
    if (step.text.toLowerCase().includes("risk")) {
     const riskMatch = step.text.match(/risk[^.]*(?:high|medium|low)[^.]*/i);
     if (riskMatch) info.risks.push(riskMatch[0]);
    }
    
    // Extract issues
    if (step.text.toLowerCase().includes("missing") || step.text.toLowerCase().includes("required")) {
     const issueMatch = step.text.match(/(?:missing|required|not obtained)[^.]*/i);
     if (issueMatch) info.issues.push(issueMatch[0]);
    }
    
    // Extract highlights (key findings)
    if (step.confidence && step.confidence >= 0.85) {
     const shortText = step.text.substring(0, 100);
     if (shortText) info.highlights.push(shortText);
    }
   }
  });

  // Extract next steps from recommendation text - more comprehensive extraction
  if (recommendation.text) {
   const text = recommendation.text;
   
   // Helper to check if text is a valid actionable next step (not just descriptive)
   const isValidNextStep = (stepText) => {
    const lower = stepText.toLowerCase();
    // Exclude sentences that are just descriptions or references
    if (lower.startsWith("recommendation:") || 
      lower.startsWith("see page") || 
      lower.includes("see page") ||
      lower.startsWith("refer to") ||
      lower.match(/^[^a-z]*$/)) { // Only punctuation/numbers
     return false;
    }
    // Must contain actionable verbs
    const hasActionVerb = /(?:request|send|trigger|set|validate|approve|deny|review|process|obtain|submit|provide|complete|follow|contact|notify)/i.test(stepText);
    return hasActionVerb && stepText.length > 15 && stepText.length < 200;
   };
   
   // Try multiple patterns to extract next steps
   // Pattern 1:"Next step:" or"Next steps:" followed by text
   const nextStepPattern1 = text.match(/(?:next step[s]?[:]?\s*)([^.!?]+(?:[.!?]+[^.!?]*){0,2})/gi);
   if (nextStepPattern1) {
    nextStepPattern1.forEach(match => {
     const cleaned = match.replace(/next step[s]?[:]?\s*/i, '').trim();
     if (cleaned && isValidNextStep(cleaned) && !info.nextSteps.includes(cleaned)) {
      info.nextSteps.push(cleaned);
     }
    });
   }
   
   // Pattern 2:"Action:" or"Actions:" followed by text
   const actionPattern = text.match(/(?:action[s]?[:]?\s*)([^.!?]+(?:[.!?]+[^.!?]*){0,2})/gi);
   if (actionPattern) {
    actionPattern.forEach(match => {
     const cleaned = match.replace(/action[s]?[:]?\s*/i, '').trim();
     if (cleaned && isValidNextStep(cleaned) && !info.nextSteps.includes(cleaned)) {
      info.nextSteps.push(cleaned);
     }
    });
   }
   
   // Pattern 3:"Should" or"Must" statements (but filter out descriptive ones)
   const shouldPattern = text.match(/(?:should|must|need to)[^.!?]*(?:[.!?]+[^.!?]*){0,1}/gi);
   if (shouldPattern) {
    shouldPattern.forEach(match => {
     const cleaned = match.trim();
     if (isValidNextStep(cleaned) && !info.nextSteps.includes(cleaned)) {
      info.nextSteps.push(cleaned);
     }
    });
   }
   
   // Pattern 4: Actionable phrases with verbs
   if (info.nextSteps.length === 0) {
    const actionablePhrases = text.match(/(?:request|send|trigger|set|validate|approve|deny|review|process|obtain|submit|provide|complete|follow|contact|notify)[^.!?]*(?:[.!?]+[^.!?]*){0,1}/gi);
    if (actionablePhrases) {
     actionablePhrases.forEach(match => {
      const cleaned = match.trim();
      if (isValidNextStep(cleaned) && !info.nextSteps.includes(cleaned)) {
       info.nextSteps.push(cleaned);
      }
     });
    }
   }
   
   // Limit to 3 most relevant next steps
   info.nextSteps = info.nextSteps.slice(0, 3);
  }

  return info;
 };

 const actionType = getActionType(recommendation.text ||"");
 const keyInfo = extractKeyInfo();
 const confidence = recommendation.confidence || 0;

 // Split recommendation text into a primary summary sentence and additional bullet points
 const rawText = (recommendation.text ||"").trim();
 let primarySentence = rawText;
 let additionalSentences = [];
 if (rawText) {
  const parts = rawText
   .replace(/\s+/g,"")
   .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
   .map((p) => p.trim())
   .filter((p) => p.length > 0);
  if (parts.length > 0) {
   primarySentence = parts[0];
   additionalSentences = parts.slice(1);
  }
 }

 // Derive primary SOP for TP Lend: scenario first, then status mapping
 const primaryScenarioSOP =
  loan?.scenario && SCENARIO_SOPS[loan.scenario]
   ? SCENARIO_SOPS[loan.scenario]
   : null;

 const statusToSOPCode = {
 "Under Review":"SOP-501",
 "Pending Documentation":"SOP-502",
 "In Underwriting":"SOP-503",
 "Conditional Approval":"SOP-504",
 "Approved":"SOP-505",
 "Denied":"SOP-506",
 };
 const statusCode =
  loan?.status && statusToSOPCode[loan.status]
   ? statusToSOPCode[loan.status]
   : null;
 const primaryStatusSOP =
  statusCode && SOP_INDEX[statusCode] ? SOP_INDEX[statusCode] : null;

 const primarySOP = primaryScenarioSOP || primaryStatusSOP || null;

 // Action type styling with gradients
 const actionStyles = {
  approve: {
   bg:"bg-gradient-to-br from-success01 via-success01 to-success01",
   border:"border-success03",
   text:"text-green-800",
   icon: CheckCircle2,
   badge:"bg-gradient-to-br from-success010 to-success03 text-white shadow-lg shadow-success010/30",
   button:"bg-gradient-to-r from-success03 to-success03 hover:from-success02 hover:to-success02 text-white shadow-lg shadow-success010/40 hover:shadow-xl hover:shadow-success010/50",
   glow:"shadow-2xl shadow-success010/20",
  },
  deny: {
   bg:"bg-gradient-to-br from-error01 via-pinkTP/10 to-error01",
   border:"border-error03",
   text:"text-error02",
   icon: XCircle,
   badge:"bg-gradient-to-br from-error010 to-pinkTP text-white shadow-lg shadow-error010/30",
   button:"bg-gradient-to-r from-error03 to-pinkTP hover:from-error02 hover:to-rose-700 text-white shadow-lg shadow-error010/40 hover:shadow-xl hover:shadow-error010/50",
   glow:"shadow-2xl shadow-error010/20",
  },
  request: {
   bg:"bg-gradient-to-br from-alert01 via-alert01 to-alert01",
   border:"border-alert02",
   text:"text-yellow-800",
   icon: AlertTriangle,
   badge:"bg-gradient-to-br from-alert010 to-alert02 text-white shadow-lg shadow-alert010/30",
   button:"bg-gradient-to-r from-alert02 to-alert02 hover:from-alert02 hover:to-amber-700 text-white shadow-lg shadow-alert010/40 hover:shadow-xl hover:shadow-alert010/50",
   glow:"shadow-2xl shadow-alert010/20",
  },
  review: {
   bg:"bg-gradient-to-br from-neutral01 via-neutral01 to-neutral01",
   border:"border-neutral02",
   text:"text-blue-800",
   icon: Clock,
   badge:"bg-gradient-to-br from-neutral010 to-primary text-white shadow-lg shadow-neutral010/30",
   button:"bg-gradient-to-r from-neutral02 to-primary hover:from-neutral02 hover:to-textLink text-white shadow-lg shadow-neutral010/40 hover:shadow-xl hover:shadow-neutral010/50",
   glow:"shadow-2xl shadow-neutral010/20",
  },
 };

 const style = actionStyles[actionType] || actionStyles.review;
 const ActionIcon = style.icon;

 // Get confidence color
 const getConfidenceColor = (conf) => {
  if (conf >= 0.9) return"text-success03";
  if (conf >= 0.75) return"text-neutral02";
  if (conf >= 0.6) return"text-alert02";
  return"text-pinkTP";
 };

 return (
  <motion.div
   ref={cardRef}
   initial={{ opacity: 0, y: -20, scale: 0.95 }}
   animate={{ opacity: 1, y: 0, scale: 1 }}
   transition={{ 
    type:"spring",
    stiffness: 300,
    damping: 25,
    mass: 0.8
   }}
   onHoverStart={() => setIsHovered(true)}
   onHoverEnd={() => setIsHovered(false)}
   className={`relative rounded-2xl border-2 ${style.border} ${style.bg} p-5 shadow-2xl ${style.glow} backdrop-blur-md overflow-hidden flex flex-col`}
  >
   {/* Animated background gradient */}
   <motion.div
    className="absolute inset-0 opacity-30"
    animate={{
     background: isHovered 
      ?"radial-gradient(circle at 50% 50%, rgba(97, 45, 145, 0.1), transparent 70%)"
      :"radial-gradient(circle at 50% 50%, rgba(97, 45, 145, 0.05), transparent 70%)"
    }}
    transition={{ duration: 0.3 }}
   />

   {/* Content */}
   <div className="relative z-10 flex flex-col flex-1 min-h-0">
    {/* Main Recommendation Section - Improved Design */}
    <div className="flex flex-col gap-4 mb-4 flex-1 min-h-0">
     {/* Header Section - More Prominent */}
     <motion.div 
      className="flex items-start gap-4 shrink-0"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type:"spring", stiffness: 250 }}
     >
      {/* Icon with enhanced animation */}
      <motion.div 
       className={`p-3 rounded-2xl ${style.badge} shadow-xl shrink-0`}
       animate={{ 
        scale: [1, 1.08, 1],
        rotate: [0, 3, -3, 0]
       }}
       transition={{ 
        duration: 4,
        repeat: Infinity,
        repeatDelay: 3
       }}
      >
       <ActionIcon className="w-6 h-6" />
      </motion.div>
      
      <div className="flex-1 min-w-0">
       <div className="flex items-center gap-3 mb-2">
        <h3 className={`font-bold text-xl ${style.text}`}>
         {actionType ==="approve" &&"Approve Loan"}
         {actionType ==="deny" &&"Deny Loan"}
         {actionType ==="request" &&"Request Information"}
         {actionType ==="review" &&"Review Required"}
        </h3>
        <motion.span 
         className={`px-3 py-1.5 rounded-full text-xs font-bold ${getConfidenceColor(confidence)} bg-white/90 backdrop-blur-md shadow-lg border-2 ${style.border}`}
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         transition={{ type:"spring", delay: 0.2, stiffness: 300 }}
        >
         {Math.round(confidence * 100)}% Confidence
        </motion.span>
       </div>
       {primarySentence && (
        <motion.p 
         className={`text-base ${style.text} opacity-95 leading-relaxed`}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 0.3 }}
        >
         {primarySentence}
        </motion.p>
       )}
       {additionalSentences.length > 0 && (
        <motion.ul
         initial={{ opacity: 0, y: 6 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.35 }}
         className="mt-2 space-y-1.5 text-sm text-text01"
        >
         {additionalSentences.map((sentence, idx) => (
          <li key={idx} className="flex items-start gap-2">
           <span className="mt-1 w-1.5 h-1.5 rounded-full bg-current opacity-70" />
           <span className="flex-1 leading-relaxed">{sentence}</span>
          </li>
         ))}
        </motion.ul>
       )}
      </div>
     </motion.div>

     {/* Primary SOP Summary */}
     {primarySOP && (
      <motion.div
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.35 }}
       className="bg-white/80 backdrop-blur-md rounded-lg p-3 border border-stroke01 shadow-sm flex items-start gap-3"
      >
       <div className="mt-0.5">
        <Sparkles className="w-4 h-4 text-pinkTP" />
       </div>
       <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-text01 uppercase tracking-wider mb-1">
         SOP Reference
        </div>
        <div className="text-sm text-text01 font-semibold mb-0.5">
         {primarySOP.title}
        </div>
        <div className="text-xs text-text02">
         {primarySOP.page
          ? `Section: ${primarySOP.page}${
            primarySOP.state && primarySOP.state !=="All"
             ? ` • State: ${primarySOP.state}`
             :""
           }`
          : primarySOP.state && primarySOP.state !=="All"
          ? `State-specific SOP • State: ${primarySOP.state}`
          :"Applies across all states / investor guidelines"}
        </div>
       </div>
      </motion.div>
     )}

     {/* Reasoning Section - Always Visible */}
     {recommendation.reasoning && (
      <motion.div
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.4 }}
       className="bg-white/70 backdrop-blur-md rounded-lg p-3 border border-stroke01 shadow-sm"
      >
       <div className="flex items-start gap-2 mb-2">
        <svg className="w-4 h-4 text-neutral02 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <circle cx="12" cy="12" r="10" strokeWidth={2} />
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4m0-4h.01" />
        </svg>
        <div className="flex-1">
         <h4 className="text-xs font-bold text-text01 mb-1">Reasoning</h4>
         <p className="text-sm text-text02 leading-relaxed">
          {recommendation.reasoning}
         </p>
        </div>
       </div>
      </motion.div>
     )}

     {/* All Identified Issues - Always Visible */}
     {keyInfo.issues.length > 0 && (
      <motion.div
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.5 }}
       className="bg-white/70 backdrop-blur-md rounded-lg p-3 border border-stroke01 shadow-sm"
      >
       <div className="flex items-start gap-2 mb-2">
        <AlertTriangle className="w-4 h-4 text-pinkTP shrink-0 mt-0.5" />
        <div className="flex-1">
         <h4 className="text-xs font-bold text-text01 mb-2 uppercase tracking-wider">All Identified Issues</h4>
         <ul className="space-y-1.5">
          {keyInfo.issues.map((issue, idx) => (
           <li key={idx} className="text-sm text-text01 leading-relaxed flex items-start gap-2">
            <span className="text-alert010 font-bold mt-0.5">•</span>
            <span className="flex-1">{issue}</span>
           </li>
          ))}
         </ul>
        </div>
       </div>
      </motion.div>
     )}
    </div>

    {/* Action Buttons */}
    <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/30 mt-auto">
     <motion.button
      onClick={() => onAction?.(actionType, recommendation)}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${style.button} flex items-center gap-2`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
     >
      <ActionIcon className="w-4 h-4" />
      <span>
       {actionType ==="approve" &&"Approve"}
       {actionType ==="deny" &&"Deny"}
       {actionType ==="request" &&"Request Info"}
       {actionType ==="review" &&"Review"}
      </span>
     </motion.button>
     
     {recommendation.sopRefs && recommendation.sopRefs.length > 0 && (
      <motion.button
       onClick={() => {
        if (loan?.scenario) {
         onSOPView?.(loan.scenario, loan.scenario, loan?.status, null);
        } else if (recommendation.sopRefs[0]) {
         onSOPView?.(recommendation.sopRefs[0], null, loan?.status, null);
        }
       }}
       className="px-4 py-2 rounded-lg font-semibold text-sm bg-white border border-stroke01 text-text01 hover:bg-bg02:bg-text02 transition-all flex items-center gap-2"
       whileHover={{ scale: 1.02 }}
       whileTap={{ scale: 0.98 }}
      >
       <FileText className="w-4 h-4" />
       SOP
      </motion.button>
     )}
    </div>

    {/* Expanded Details with smooth animation */}
    <AnimatePresence>
     {expanded && (
      <motion.div
       initial={{ height: 0, opacity: 0 }}
       animate={{ height:"auto", opacity: 1 }}
       exit={{ height: 0, opacity: 0 }}
       transition={{ type:"spring", stiffness: 300, damping: 30 }}
       className="overflow-hidden"
      >
       <div className="mt-5 pt-5 border-t border-white/30 space-y-4">
         {/* Full Recommendation section removed - already shown in main section above */}
        
        {recommendation.reasoning && (
         <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
         >
          <h4 className="text-xs font-bold text-text01 mb-2 uppercase tracking-wider">Reasoning</h4>
          <p className="text-sm text-text02 leading-relaxed">
           {recommendation.reasoning}
          </p>
         </motion.div>
        )}

        {recommendation.sopRefs && recommendation.sopRefs.length > 0 && (
         <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
         >
          <h4 className="text-xs font-bold text-text01 mb-3 uppercase tracking-wider">SOP References</h4>
          <div className="flex flex-wrap gap-2">
           {recommendation.sopRefs.map((ref, idx) => (
            <motion.button
             key={idx}
             onClick={() => onSOPView?.(ref, null, loan?.status, null)}
             className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-pinkTP/10 to-pinkTP/10 text-pinkTP/20/20 hover:from-pinkTP/30 hover:to-pinkTP/30:from-pinkTP/30:to-pinkTP/30 transition-all shadow-md hover:shadow-lg flex items-center gap-2 border border-pinkTP/20"
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.4 + idx * 0.1 }}
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
            >
             <FileText className="w-3 h-3" />
             {ref}
            </motion.button>
           ))}
          </div>
         </motion.div>
        )}
       </div>
      </motion.div>
     )}
    </AnimatePresence>
   </div>
  </motion.div>
 );
}

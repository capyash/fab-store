import { useState, useEffect } from"react";
import { CheckCircle2, AlertCircle, Clock, XCircle, FileText, BookOpen, Shield, ChevronDown, ChevronUp, ExternalLink, AlertTriangle } from"lucide-react";
import { motion, AnimatePresence } from"framer-motion";
import { processPreScreening } from"../services/preScreeningService";
import DenialCodeBadge from"./DenialCodeBadge";
import TransparencyLog from"./TransparencyLog";
import { SCENARIO_SOPS, getSOPByScenario } from"../data/sops";

/**
 * Pre-Screening Summary - Compact integrated view
 * Shows rule-based pre-screening results above AI Reasoning
 * All information from PreScreeningWorkflow is preserved
 */
export default function PreScreeningSummary({ claim, onSOPView, onSOPReference, onComplete }) {
 const [result, setResult] = useState(null);
 const [processing, setProcessing] = useState(false);
 const [expanded, setExpanded] = useState(false);
 const [error, setError] = useState(null);

 useEffect(() => {
  if (!claim) return;

  setResult(null);
  setProcessing(true);
  setError(null);

  const startProcessing = async () => {
   try {
    const screeningResult = await processPreScreening(claim, (updatedResult) => {
     setResult(updatedResult);
     if (updatedResult.documentReferences && updatedResult.documentReferences.length > 0 && onSOPReference) {
      onSOPReference(updatedResult.documentReferences);
     }
    });
    setResult(screeningResult);
    setProcessing(false);
    
    // Notify parent that pre-screening is complete
    if (onComplete) {
     onComplete(screeningResult);
    }
   } catch (err) {
    console.error("Pre-screening error:", err);
    setError(err.message);
    setProcessing(false);
   }
  };

  startProcessing();
 }, [claim?.id, onSOPReference, onComplete]);

 if (!claim) return null;

 const scenario = claim.scenario;
 const sop = scenario ? getSOPByScenario(scenario) : null;

 const getScenarioTitle = (scenario) => {
  const scenarioTitles = {
  "build-days":"Build Days Exceed Authorized Days (Texas)",
  "texas-medicaid-limits":"Texas Medicaid Day Limits Exceeded",
  "cob":"Coordination of Benefits (COB)",
  "cob-primary-payer":"Coordination of Benefits - Primary Payer",
  "cob-medicare-secondary":"Medicare as Secondary Payer",
  "precertification":"Precertification Requirements",
  "precertification-required":"Precertification Required",
  "prior-auth-missing":"Missing Prior Authorization",
  "medical-necessity":"Medical Necessity Review",
  "provider-out-of-network":"Out-of-Network Provider",
  "california-medi-cal-prior-auth":"California Medi-Cal Prior Authorization",
  "new-york-medicaid-inpatient":"New York Medicaid Inpatient Authorization",
  "florida-medicaid-elective-surgery":"Florida Medicaid Elective Surgery Authorization",
  "timely-filing":"Timely Filing Deadline Exceeded",
  "bundled-services":"Bundled Services (CCI Edits)",
  "invalid-cpt-code":"Invalid CPT Code",
  "generic":"Standard Pre-Screening",
  };
  return scenarioTitles[scenario] ||"Pre-Screening";
 };

 const getStepIcon = (status) => {
  if (status ==="success") return <CheckCircle2 className="w-3.5 h-3.5 text-success010" />;
  if (status ==="warning") return <AlertCircle className="w-3.5 h-3.5 text-alert010" />;
  if (status ==="error") return <XCircle className="w-3.5 h-3.5 text-error010" />;
  return <Clock className="w-3.5 h-3.5 text-text03 animate-pulse" />;
 };

 const getStepStatusColor = (status) => {
  switch (status) {
   case"success":
    return"border-success010 bg-success01";
   case"warning":
    return"border-alert010 bg-alert01";
   case"error":
    return"border-error010 bg-error01";
   default:
    return"border-stroke01 bg-bg02";
  }
 };

 const getRecommendationColor = (action) => {
  if (action ==="DENY") return"border-error010 bg-error01 text-error02";
  if (action ==="APPROVE") return"border-success010 bg-success01 text-green-800";
  return"border-neutral010 bg-neutral01 text-blue-800";
 };

 const successCount = result?.steps.filter(s => s.status ==="success").length || 0;
 const totalSteps = result?.steps.length || 0;
 const hasErrors = result?.steps.some(s => s.status ==="error") || false;
 const hasWarnings = result?.steps.some(s => s.status ==="warning") || false;

 return (
  <motion.div
   initial={{ opacity: 0, y: -10 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ delay: 0.1 }}
   className="bg-white/80 backdrop-blur-md rounded-xl border-2 border-stroke01 p-4 shadow-lg mb-4"
  >
   {/* Header */}
   <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3 flex-1 min-w-0">
     <div className="p-2 rounded-lg bg-gradient-to-br from-success010 to-neutral010 shadow-md shrink-0">
      <Shield className="w-4 h-4 text-white" />
     </div>
     <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
       <h3 className="text-sm font-bold text-text01">
        Rule-Based Pre-Screening
       </h3>
       {result && (
        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
         hasErrors ?"bg-error01 text-error02" :
         hasWarnings ?"bg-alert01 text-alert02" :
        "bg-success01 text-success02"
        }`}>
         {successCount}/{totalSteps} Passed
        </span>
       )}
      </div>
      <p className="text-[10px] text-text02 mt-0.5 truncate">
       {result ? getScenarioTitle(result.scenario) :"Processing rule-based checks..."}
      </p>
     </div>
     {sop && result && (
      <div className="flex items-center gap-2 text-xs bg-white/60 px-2 py-1 rounded shrink-0">
       <BookOpen className="w-3 h-3 text-pinkTP" />
       <span className="text-[10px] font-medium text-text01">{sop.page}</span>
      </div>
     )}
    </div>
    {result && (
     <button
      onClick={() => setExpanded(!expanded)}
      className="px-2 py-1 rounded-md text-xs font-medium bg-bg03 text-text01 hover:bg-stroke01:bg-text01 transition-colors flex items-center gap-1 shrink-0 ml-2"
     >
      {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      {expanded ?"Less" :"Details"}
     </button>
    )}
   </div>

   {/* Processing State */}
   {processing && !result && (
    <div className="flex items-center gap-2 text-sm text-text02 py-2">
     <Clock className="w-4 h-4 animate-spin text-pinkTP" />
     <span>Running rule-based compliance checks...</span>
    </div>
   )}

   {/* Error State */}
   {error && (
    <div className="bg-error01 border border-error01 rounded-lg p-3">
     <div className="flex items-center gap-2 text-error02 text-xs">
      <AlertTriangle className="w-4 h-4" />
      <span>Error: {error}</span>
     </div>
    </div>
   )}

   {/* Results - Compact View */}
   {result && (
    <div className="space-y-3">
     {/* Steps Summary - Always Visible (Compact) */}
     {result.steps.length > 0 && (
      <div className="space-y-1.5">
       <div className="flex items-center gap-2 mb-1.5">
        <FileText className="w-3.5 h-3.5 text-text02" />
        <span className="text-[10px] font-semibold text-text02 uppercase tracking-wide">
         Processing Steps
        </span>
       </div>
       <div className="grid grid-cols-2 gap-1.5">
        {result.steps.slice(0, 4).map((step, idx) => (
         <motion.div
          key={idx}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md border-l-2 ${getStepStatusColor(step.status)}`}
         >
          {getStepIcon(step.status)}
          <div className="flex-1 min-w-0">
           <span className="text-[10px] font-medium text-text01 block truncate">
            Step {step.step}: {step.title}
           </span>
          </div>
         </motion.div>
        ))}
       </div>
       {result.steps.length > 4 && !expanded && (
        <button
         onClick={() => setExpanded(true)}
         className="text-[10px] text-pinkTP hover:underline font-medium"
        >
         +{result.steps.length - 4} more steps
        </button>
       )}
      </div>
     )}

     {/* Recommendation - Always Visible */}
     {result.recommendation && (
      <motion.div
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 1, scale: 1 }}
       className={`rounded-lg p-3 border-2 ${getRecommendationColor(result.recommendation.action)}`}
      >
       <div className="flex items-start gap-2">
        <Shield className={`w-4 h-4 mt-0.5 shrink-0 ${
         result.recommendation.action ==="DENY" ?"text-error010" :
         result.recommendation.action ==="APPROVE" ?"text-success010" :
        "text-neutral010"
        }`} />
        <div className="flex-1 min-w-0">
         <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <span className="font-semibold text-xs">
           Recommendation: {result.recommendation.action}
          </span>
          {result.denialCodes && result.denialCodes.length > 0 && (
           <div className="flex items-center gap-1 flex-wrap">
            {result.denialCodes.slice(0, 2).map((code, idx) => (
             <DenialCodeBadge key={idx} code={code.code} description={code.description} />
            ))}
            {result.denialCodes.length > 2 && !expanded && (
             <span className="text-[9px] text-text02">
              +{result.denialCodes.length - 2} more
             </span>
            )}
           </div>
          )}
         </div>
         <p className="text-xs text-text01 leading-relaxed">
          {result.recommendation.reason}
         </p>
         {result.recommendation.sopReference && (
          <button
           onClick={() => {
            const sopRef = result.recommendation.sopReference;
            if (sopRef.includes("Page")) {
             const pageNum = sopRef.replace("Page","").replace("page","").split("-")[0];
             Object.entries(SCENARIO_SOPS).forEach(([scen, sop]) => {
              if (sop.page && sop.page.includes(pageNum)) {
               onSOPView?.(scen, scen, claim?.status, null);
              }
             });
            } else if (claim?.scenario) {
             onSOPView?.(claim.scenario, claim.scenario, claim?.status, null);
            }
           }}
           className="mt-2 flex items-center gap-1 px-2 py-1 text-[10px] font-medium bg-pinkTP text-white rounded-md hover:bg-pinkTP transition-colors"
          >
           <FileText className="w-3 h-3" />
           View SOP
           <ExternalLink className="w-3 h-3" />
          </button>
         )}
        </div>
       </div>
      </motion.div>
     )}

     {/* Expanded Details - All Steps, Denial Codes, Transparency Log */}
     <AnimatePresence>
      {expanded && (
       <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height:"auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ type:"spring", stiffness: 300, damping: 30 }}
        className="overflow-hidden"
       >
        <div className="mt-3 pt-3 border-t border-stroke01 space-y-4">
         {/* All Processing Steps */}
         {result.steps.length > 0 && (
          <div className="space-y-2">
           <h4 className="font-semibold text-xs text-text01 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            All Processing Steps
           </h4>
           <div className="space-y-2">
            {result.steps.map((step, index) => (
             <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-l-4 rounded-r-lg p-3 ${getStepStatusColor(step.status)}`}
             >
              <div className="flex items-start gap-3">
               <div className="flex-shrink-0 mt-0.5">
                {getStepIcon(step.status)}
               </div>
               <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                 <span className="font-medium text-xs text-text01">
                  Step {step.step}: {step.title}
                 </span>
                 {step.status ==="error" && (
                  <span className="text-[9px] text-error03 font-medium">
                   REQUIRES ATTENTION
                  </span>
                 )}
                </div>
                <p className="text-xs text-text01">
                 {step.action}
                </p>
                {step.details && Object.keys(step.details).length > 0 && (
                 <details className="mt-2">
                  <summary className="text-[10px] text-text03 cursor-pointer hover:text-text01:text-stroke01">
                   View details
                  </summary>
                  <div className="mt-2 p-2 bg-white rounded text-[10px]">
                   <pre className="whitespace-pre-wrap text-text01">
                    {JSON.stringify(step.details, null, 2)}
                   </pre>
                  </div>
                 </details>
                )}
               </div>
              </div>
             </motion.div>
            ))}
           </div>
          </div>
         )}

         {/* All Denial Codes */}
         {result.denialCodes && result.denialCodes.length > 0 && (
          <div className="space-y-2">
           <h4 className="font-semibold text-xs text-text01 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            All Denial Codes
           </h4>
           <div className="flex flex-wrap gap-2">
            {result.denialCodes.map((code, idx) => (
             <DenialCodeBadge key={idx} code={code.code} description={code.description} />
            ))}
           </div>
          </div>
         )}

         {/* Transparency Log */}
         {result.log && result.log.length > 0 && (
          <div className="space-y-2">
           <h4 className="font-semibold text-xs text-text01 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Transparency Log
           </h4>
           <TransparencyLog logEntries={result.log} />
          </div>
         )}

         {/* Completion Status */}
         {result.completed && (
          <div className="bg-success01 border border-success01 rounded-lg p-3">
           <div className="flex items-center gap-2 text-green-800">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium text-xs">
             Pre-screening completed in {(result.totalTime / 1000).toFixed(2)}s
            </span>
           </div>
          </div>
         )}
        </div>
       </motion.div>
      )}
     </AnimatePresence>
    </div>
   )}
  </motion.div>
 );
}


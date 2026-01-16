import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, TrendingDown, Minus } from"lucide-react";
import { motion } from"framer-motion";

/**
 * Recommendation Comparison Component
 * Shows side-by-side comparison of Pre-Screening (Rule-Based) vs AI Reasoning recommendations
 */
export default function RecommendationComparison({ preScreeningResult, aiRecommendation }) {
 if (!preScreeningResult?.recommendation && !aiRecommendation) return null;

 const preScreeningAction = preScreeningResult?.recommendation?.action;
 // Extract AI action from recommendation object - check multiple possible fields
 const aiAction = aiRecommendation?.action || 
  aiRecommendation?.actionType ||
  (aiRecommendation?.text?.toLowerCase().includes("deny") || aiRecommendation?.text?.toLowerCase().includes("should be denied") ?"DENY" :
   aiRecommendation?.text?.toLowerCase().includes("approve") || aiRecommendation?.text?.toLowerCase().includes("may proceed") || aiRecommendation?.text?.toLowerCase().includes("proceed") ?"APPROVE" :
   aiRecommendation?.text?.toLowerCase().includes("review") || aiRecommendation?.text?.toLowerCase().includes("requires review") ?"REVIEW" :
   aiRecommendation?.text?.toLowerCase().includes("process") ?"APPROVE" : null);

 // Normalize actions for comparison
 const normalizeAction = (action) => {
  if (!action) return null;
  const upper = action.toUpperCase();
  if (upper ==="PROCESS") return"APPROVE";
  return upper;
 };

 const normalizedPreScreening = normalizeAction(preScreeningAction);
 const normalizedAI = normalizeAction(aiAction);

 // Determine agreement status
 const getAgreementStatus = () => {
  if (!normalizedPreScreening || !normalizedAI) return"unknown";
  if (normalizedPreScreening === normalizedAI) return"agree";
  return"disagree";
 };

 const agreementStatus = getAgreementStatus();

 const getActionColor = (action) => {
  if (action ==="DENY") return"text-error03 bg-error01 border-error01";
  if (action ==="APPROVE") return"text-success03 bg-success01 border-success01";
  return"text-neutral02 bg-neutral01 border-neutral01";
 };

 const getAgreementIcon = () => {
  if (agreementStatus ==="agree") {
   return <CheckCircle2 className="w-5 h-5 text-success010" />;
  }
  if (agreementStatus ==="disagree") {
   return <AlertTriangle className="w-5 h-5 text-alert010" />;
  }
  return <Minus className="w-5 h-5 text-text03" />;
 };

 const getAgreementText = () => {
  if (agreementStatus ==="agree") {
   return"Recommendations Agree";
  }
  if (agreementStatus ==="disagree") {
   return"Recommendations Differ - Review Required";
  }
  return"Comparison Unavailable";
 };

 const getAgreementColor = () => {
  if (agreementStatus ==="agree") {
   return"bg-success01 border-success01 text-green-800";
  }
  if (agreementStatus ==="disagree") {
   return"bg-alert01 border-alert01 text-orange-800";
  }
  return"bg-bg02 border-stroke01 text-text01";
 };

 return (
  <motion.div
   initial={{ opacity: 0, y: 10 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ delay: 0.3 }}
   className="bg-white/80 backdrop-blur-md rounded-xl border-2 border-stroke01 p-4 shadow-lg mb-4"
  >
   {/* Header */}
   <div className="flex items-center gap-3 mb-4">
    <div className="p-2 rounded-lg bg-gradient-to-br from-pinkTP/100 to-neutral010 shadow-md">
     <TrendingUp className="w-4 h-4 text-white" />
    </div>
    <div className="flex-1">
     <h3 className="text-sm font-bold text-text01">
      Recommendation Comparison
     </h3>
     <p className="text-[10px] text-text02 mt-0.5">
      Rule-Based vs AI-Powered Analysis
     </p>
    </div>
    <div className={`px-3 py-1.5 rounded-lg border ${getAgreementColor()} flex items-center gap-2`}>
     {getAgreementIcon()}
     <span className="text-xs font-semibold">{getAgreementText()}</span>
    </div>
   </div>

   {/* Comparison Grid */}
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Pre-Screening Recommendation */}
    <div className="space-y-2">
     <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 rounded bg-success010/20">
       <CheckCircle2 className="w-3.5 h-3.5 text-success03" />
      </div>
      <span className="text-xs font-semibold text-text01 uppercase tracking-wide">
       Rule-Based Pre-Screening
      </span>
     </div>
     {preScreeningResult?.recommendation ? (
      <div className={`rounded-lg p-3 border-2 ${getActionColor(normalizedPreScreening)}`}>
       <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-sm">{normalizedPreScreening}</span>
        {agreementStatus ==="agree" && normalizedPreScreening === normalizedAI && (
         <CheckCircle2 className="w-4 h-4 text-success010" />
        )}
       </div>
       <p className="text-xs text-text01 leading-relaxed">
        {preScreeningResult.recommendation.reason}
       </p>
       {preScreeningResult.denialCodes && preScreeningResult.denialCodes.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
         {preScreeningResult.denialCodes.slice(0, 2).map((code, idx) => (
          <span
           key={idx}
           className="px-2 py-0.5 rounded text-[9px] font-medium bg-error01 text-error02"
          >
           {code.code}
          </span>
         ))}
        </div>
       )}
      </div>
     ) : (
      <div className="rounded-lg p-3 border-2 border-stroke01 bg-bg02">
       <p className="text-xs text-text03">No pre-screening recommendation available</p>
      </div>
     )}
    </div>

    {/* AI Reasoning Recommendation */}
    <div className="space-y-2">
     <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 rounded bg-pinkTP/100/20">
       <TrendingUp className="w-3.5 h-3.5 text-pinkTP" />
      </div>
      <span className="text-xs font-semibold text-text01 uppercase tracking-wide">
       AI-Powered Reasoning
      </span>
     </div>
     {aiRecommendation ? (
      <div className={`rounded-lg p-3 border-2 ${getActionColor(normalizedAI)}`}>
       <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-sm">{normalizedAI ||"REVIEW"}</span>
        {agreementStatus ==="agree" && normalizedPreScreening === normalizedAI && (
         <CheckCircle2 className="w-4 h-4 text-success010" />
        )}
        {agreementStatus ==="disagree" && (
         <TrendingDown className="w-4 h-4 text-alert010" />
        )}
       </div>
       <p className="text-xs text-text01 leading-relaxed">
        {aiRecommendation.text || aiRecommendation.reason ||"AI analysis recommendation"}
       </p>
       {aiRecommendation.confidence && (
        <div className="mt-2">
         <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-stroke01 rounded-full overflow-hidden">
           <div
            className="h-full bg-gradient-to-r from-pinkTP/100 to-neutral010 rounded-full"
            style={{ width: `${(aiRecommendation.confidence || 0) * 100}%` }}
           />
          </div>
          <span className="text-[9px] font-semibold text-text02">
           {Math.round((aiRecommendation.confidence || 0) * 100)}%
          </span>
         </div>
        </div>
       )}
      </div>
     ) : (
      <div className="rounded-lg p-3 border-2 border-stroke01 bg-bg02">
       <p className="text-xs text-text03">AI reasoning in progress...</p>
      </div>
     )}
    </div>
   </div>

   {/* Agreement Details */}
   {agreementStatus ==="disagree" && (
    <motion.div
     initial={{ opacity: 0, height: 0 }}
     animate={{ opacity: 1, height:"auto" }}
     className="mt-4 pt-4 border-t border-alert01"
    >
     <div className="flex items-start gap-2">
      <AlertTriangle className="w-4 h-4 text-alert010 mt-0.5 shrink-0" />
      <div className="flex-1">
       <p className="text-xs font-semibold text-orange-800 mb-1">
        Recommendation Mismatch Detected
       </p>
       <p className="text-xs text-text01">
        The rule-based pre-screening and AI reasoning have different recommendations. 
        This may indicate an edge case or nuanced scenario requiring human review. 
        Please review both analyses carefully before making a decision.
       </p>
      </div>
     </div>
    </motion.div>
   )}

   {agreementStatus ==="agree" && (
    <motion.div
     initial={{ opacity: 0, height: 0 }}
     animate={{ opacity: 1, height:"auto" }}
     className="mt-4 pt-4 border-t border-success01"
    >
     <div className="flex items-start gap-2">
      <CheckCircle2 className="w-4 h-4 text-success010 mt-0.5 shrink-0" />
      <div className="flex-1">
       <p className="text-xs font-semibold text-green-800 mb-1">
        High Confidence Recommendation
       </p>
       <p className="text-xs text-text01">
        Both rule-based pre-screening and AI reasoning agree on the recommendation, 
        providing high confidence in the decision.
       </p>
      </div>
     </div>
    </motion.div>
   )}
  </motion.div>
 );
}


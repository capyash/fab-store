import { useEffect, useState } from"react";
import Tabs from"./Tabs";
import { SOP_INDEX } from"../data/sops";

export default function ClaimDetailsPanel({ claim, onClose }) {
 // --- Mock AI generation ---
 const [insights, setInsights] = useState({ loading: true, text:"", confidence: null, ref:"" });
 const [activeLineItem, setActiveLineItem] = useState(null);

 useEffect(() => {
  if (!claim) return;
  setInsights({ loading: true, text:"", confidence: null, ref:"" });
  const timer = setTimeout(() => {
   // Simple deterministic mock based on status
   const sop = SOP_INDEX[claim.status];
   const text =
    claim.status ==="Information Needed"
     ? `Likely blocker: Missing documentation from provider.\nNext step: Trigger provider info request and set 48h follow-up.\nWhy: SOP"${sop?.title}" step 1–2.`
     : claim.status ==="Pending Review"
     ? `Likely blocker: Auth/coding verification.\nNext step: Validate pre-auth and code modifiers; if missing, request resubmission.\nWhy: SOP"${sop?.title}" step 1–3.`
     : claim.status ==="Under Process"
     ? `Likely blocker: Awaiting adjudication checks.\nNext step: Run policy-limit validation and prepare summary for approver.\nWhy: SOP"${sop?.title}" step 1 & 3.`
     : `Escalation in effect.\nNext step: Ensure complete artifacts and route to L2 clinical reviewer.\nWhy: SOP"${sop?.title}" step 1–2.`;
   setInsights({
    loading: false,
    text,
    confidence: 0.88,
    ref: sop?.link ||"#"
   });
  }, 600); // quick “AI thinking” feel
  return () => clearTimeout(timer);
 }, [claim]);

 if (!claim) return null;

 const sop = SOP_INDEX[claim.status];

 const getLineItemNextSteps = (li) => {
  if (!li) return [];

  const steps = [];

  if (li.denialCodes && li.denialCodes.length > 0) {
   steps.push("Review denial codes and confirm if documentation supports an overturn.");
   steps.push("Cross‑check this line item against the applicable SOP section for appeal rules.");
  }

  if (li.cptCode && li.icd10Code) {
   steps.push(`Validate coding alignment between CPT ${li.cptCode} and ICD‑10 ${li.icd10Code}.`);
  }

  if (li.status ==="Pending Review" || claim.status ==="Information Needed") {
   steps.push("Request any missing clinical records or itemized bills tied to this line item.");
  }

  if (steps.length === 0) {
   steps.push("Confirm coverage and medical necessity rules for this line item.");
   steps.push("If clean, bundle for final adjudication with the rest of the claim.");
  }

  return steps;
 };

 const DetailsTab = (
  <div className="space-y-4 text-sm">
   <div className="grid grid-cols-2 gap-3">
    <Field k="Claim ID" v={claim.id} />
    <Field k="Member" v={claim.member} />
    <Field k="Provider" v={claim.provider} />
    <Field k="Status" v={claim.status} />
    <Field k="Amount" v={`$${claim.amount.toLocaleString()}`} />
    <Field k="Date" v={claim.date} />
   </div>

   {Array.isArray(claim.lineItems) && claim.lineItems.length > 0 && (
    <div className="mt-2">
     <div className="flex items-center justify-between mb-2">
      <div className="text-xs font-semibold text-text03 uppercase tracking-wide">
       Line Items ({claim.lineItems.length})
      </div>
     </div>
     <div className="border border-stroke01 rounded-lg overflow-hidden">
      <table className="w-full text-xs">
       <thead className="bg-bg02">
        <tr>
         <th className="px-2 py-1 text-left font-medium text-text02">Line</th>
         <th className="px-2 py-1 text-left font-medium text-text02">Description</th>
         <th className="px-2 py-1 text-left font-medium text-text02">CPT</th>
         <th className="px-2 py-1 text-left font-medium text-text02">ICD‑10</th>
         <th className="px-2 py-1 text-left font-medium text-text02">Amount</th>
         <th className="px-2 py-1 text-left font-medium text-text02">Status</th>
        </tr>
       </thead>
       <tbody className="divide-y divide-bg03">
        {claim.lineItems.map((li) => (
         <tr
          key={li.lineId}
          className={`cursor-pointer hover:bg-bg02:bg-text01/70 ${
           activeLineItem?.lineId === li.lineId ?"bg-bg02" :""
          }`}
          onClick={() =>
           setActiveLineItem((prev) => (prev?.lineId === li.lineId ? null : li))
          }
         >
          <td className="px-2 py-1 font-medium text-text01">{li.lineId}</td>
          <td className="px-2 py-1 text-text01">{li.description}</td>
          <td className="px-2 py-1 text-text01">{li.cptCode}</td>
          <td className="px-2 py-1 text-text01">{li.icd10Code}</td>
          <td className="px-2 py-1 text-text01">
           {li.amount != null ? `$${li.amount.toLocaleString()}` :"—"}
          </td>
          <td className="px-2 py-1">
           <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-bg03 text-text01">
            {li.status || claim.status}
           </span>
          </td>
         </tr>
        ))}
       </tbody>
      </table>
     </div>

     {activeLineItem && (
      <div className="mt-3 p-3 rounded-lg bg-tertiary/30 border border-pinkTP/20">
       <div className="text-xs font-semibold text-pinkTP[tertiary] uppercase tracking-wide mb-1">
        Next steps for {activeLineItem.lineId}
       </div>
       <div className="text-[11px] text-text01 mb-1">
        {activeLineItem.description}
       </div>
       <ul className="list-disc list-inside space-y-1 text-[11px] text-text01">
        {getLineItemNextSteps(activeLineItem).map((s, idx) => (
         <li key={idx}>{s}</li>
        ))}
       </ul>
      </div>
     )}
    </div>
   )}
   <details className="mt-2">
    <summary className="cursor-pointer underline">Raw JSON</summary>
    <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(claim, null, 2)}</pre>
   </details>
  </div>
 );

 const AiTab = (
  <div className="text-sm">
   {insights.loading ? (
    <div className="animate-pulse space-y-2">
     <div className="h-3 bg-stroke01 rounded w-3/4" />
     <div className="h-3 bg-stroke01 rounded w-2/3" />
     <div className="h-3 bg-stroke01 rounded w-1/2" />
    </div>
   ) : (
    <div className="space-y-3">
     <p className="whitespace-pre-line">{insights.text}</p>
     <div className="text-xs text-text02">
      Confidence: {(insights.confidence * 100).toFixed(0)}%
     </div>
     <a href={insights.ref} target="_blank" rel="noreferrer" className="text-xs underline text-pinkTP">
      View SOP reference
     </a>
     <div className="pt-3 flex items-center gap-2">
      <button
       onClick={() => {
        // In the real app, this will POST to your backend to accept the recommendation
        console.log("AI insight accepted (demo)");
       }}
       className="px-3 py-2 text-sm rounded-md text-white"
       style={{ backgroundColor:"pinkTP" }}
      >
       Accept Recommendation
      </button>
      <span className="text-[11px] text-text03">
       Demo only – no real action taken
      </span>
     </div>
    </div>
   )}
  </div>
 );

 const SopTab = (
  <div className="text-sm space-y-2">
   <div className="font-medium">{sop?.title ||"SOP not found for this status"}</div>
   <ol className="list-decimal ml-5 space-y-1">
    {(sop?.steps || []).map((s, i) => <li key={i}>{s}</li>)}
   </ol>
   {sop?.link && (
    <a href={sop.link} target="_blank" rel="noreferrer" className="underline text-pinkTP text-xs">
     Open full SOP
    </a>
   )}
  </div>
 );

 return (
  <div className="h-full">
   {/* Title bar */}
   <div className="flex items-center justify-between px-4 py-3 border-b border-stroke01">
    <div>
     <div className="text-sm opacity-70">Claim</div>
     <div className="text-lg font-semibold">{claim.id}</div>
    </div>
    <button
     onClick={onClose}
     className="px-3 py-1 rounded-md border border-stroke01 hover:bg-bg03:bg-text01 text-sm"
    >
     Close
    </button>
   </div>

   {/* Tabs */}
   <Tabs
    initial={0}
    tabs={[
     { label:"Details",  content: DetailsTab },
     { label:"AI Insights",content: AiTab },
     { label:"SOP",    content: SopTab },
    ]}
   />
  </div>
 );
}

function Field({ k, v }) {
 return (
  <div>
   <div className="text-xs uppercase opacity-60">{k}</div>
   <div className="font-medium">{v}</div>
  </div>
 );
}

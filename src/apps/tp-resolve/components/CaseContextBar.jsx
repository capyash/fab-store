import { ArrowLeft, ChevronRight, Clock, AlertCircle, PanelRight } from"lucide-react";

export default function CaseContextBar({ caseData, onBack, onToggleSop, sopOpen = false }) {
 // Calculate deadline urgency
 const getDeadlineColor = () => {
  if (!caseData?.daysUntilDeadline) return"text-text02";
  if (caseData.daysUntilDeadline < 0) return"text-error03";
  if (caseData.daysUntilDeadline < 7) return"text-pinkTP";
  if (caseData.daysUntilDeadline < 14) return"text-alert02";
  return"text-success03";
 };

 const getDeadlineText = () => {
  if (!caseData?.daysUntilDeadline) return"N/A";
  if (caseData.daysUntilDeadline < 0) return `${Math.abs(caseData.daysUntilDeadline)} days overdue`;
  if (caseData.daysUntilDeadline === 0) return"Due today";
  if (caseData.daysUntilDeadline === 1) return"Due tomorrow";
  return `${caseData.daysUntilDeadline} days remaining`;
 };

 return (
  <div className="flex items-center justify-between bg-white border-b border-stroke01 shadow-sm px-6 py-3.5 sticky top-0 z-20">
   {/* Left side - Back button and breadcrumb */}
   <div className="flex items-center gap-3">
    <button 
     onClick={onBack} 
     className="flex items-center gap-1.5 text-sm font-medium text-text01 hover:text-pinkTP:text-pinkTP transition-colors"
    >
     <ArrowLeft className="w-4 h-4" />
     Back
    </button>
    
    <div className="flex items-center gap-2 text-sm text-text03">
     <span>Worklist</span>
     <ChevronRight className="w-3.5 h-3.5" />
     <span>Case {caseData.caseNumber}</span>
     <ChevronRight className="w-3.5 h-3.5" />
     <span className="text-text01 font-medium">AI Reasoning</span>
    </div>
   </div>

   {/* Right side - Case details and SOP toggle */}
   <div className="flex items-center gap-4">
    {/* Case Type */}
    <div className="flex items-center gap-1.5 text-sm">
     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
      caseData.type ==="Appeal" 
       ?"bg-neutral01 text-neutral02"
       :"bg-pinkTP/20 text-textLink"
     }`}>
      {caseData.type}
     </span>
    </div>

    {/* Complainant */}
    <div className="flex items-center gap-1.5 text-sm">
     <svg className="w-4 h-4 text-text03" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
     </svg>
     <span className="text-text01 font-medium">{caseData.complainant?.name}</span>
    </div>

    {/* Issue Type */}
    <div className="flex items-center gap-1.5 text-sm">
     <AlertCircle className="w-4 h-4 text-text03" />
     <span className="text-text02">{caseData.issueType}</span>
    </div>

    {/* Deadline */}
    <div className={`flex items-center gap-1.5 text-sm ${getDeadlineColor()}`}>
     <Clock className="w-4 h-4" />
     <span className="font-semibold">{getDeadlineText()}</span>
    </div>

    {/* Amount */}
    <div className="flex items-center gap-1.5 text-sm">
     <svg className="w-4 h-4 text-text03" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
     </svg>
     <span className="text-text01 font-semibold">
      ${caseData.amount?.toLocaleString() || '0'}
     </span>
    </div>

    {/* Status */}
    <div className="flex items-center gap-1.5">
     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
      caseData.status ==="Resolved" 
       ?"bg-success01 text-success02"
       : caseData.status ==="Escalated"
       ?"bg-error01 text-error02"
       : caseData.status ==="Under Investigation"
       ?"bg-neutral01 text-neutral02"
       :"bg-bg03 text-text01"
     }`}>
      {caseData.status}
     </span>
    </div>

    {/* SOP Toggle Button */}
    <button
     onClick={onToggleSop}
     className={`p-2.5 rounded-lg transition-all flex items-center gap-2 ${
      sopOpen 
       ? 'bg-pinkTP text-white hover:bg-pinkTP shadow-md' 
       : 'bg-bg03 text-text01 hover:bg-stroke01:bg-text01'
     }`}
     title={sopOpen ?"Close SOP Reference Panel" :"Open SOP Reference Panel"}
    >
     <PanelRight className={`w-5 h-5 ${sopOpen ? '' : 'opacity-70'}`} />
     <span className="text-xs font-medium hidden sm:inline">
      {sopOpen ? 'SOP' : 'SOP'}
     </span>
    </button>
   </div>
  </div>
 );
}


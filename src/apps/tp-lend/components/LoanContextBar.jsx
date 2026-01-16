import { ArrowLeft, ChevronRight, Clock, AlertCircle, PanelRight } from"lucide-react";

export default function LoanContextBar({ loanData, onBack, onToggleSop, sopOpen = false }) {
 // Calculate SLA urgency
 const getSLAColor = () => {
  if (!loanData?.daysUntilSLA) return"text-text02";
  if (loanData.daysUntilSLA < 0) return"text-error03";
  if (loanData.daysUntilSLA < 7) return"text-pinkTP";
  if (loanData.daysUntilSLA < 14) return"text-alert02";
  return"text-success03";
 };

 const getSLAText = () => {
  if (!loanData?.daysUntilSLA) return"N/A";
  if (loanData.daysUntilSLA < 0) return `${Math.abs(loanData.daysUntilSLA)} days overdue`;
  if (loanData.daysUntilSLA === 0) return"Due today";
  if (loanData.daysUntilSLA === 1) return"Due tomorrow";
  return `${loanData.daysUntilSLA} days remaining`;
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
     <span>Loan {loanData.loanNumber}</span>
     <ChevronRight className="w-3.5 h-3.5" />
     <span className="text-text01 font-medium">AI Reasoning</span>
    </div>
   </div>

   {/* Right side - Loan details and SOP toggle */}
   <div className="flex items-center gap-4">
    {/* Loan Type */}
    <div className="flex items-center gap-1.5 text-sm">
     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
      loanData.loanType ==="FHA" 
       ?"bg-neutral01 text-neutral02"
       : loanData.loanType ==="VA"
       ?"bg-success01 text-success02"
       : loanData.loanType ==="Jumbo"
       ?"bg-pinkTP/20 text-textLink"
       :"bg-bg03 text-text01"
     }`}>
      {loanData.loanType}
     </span>
    </div>

    {/* Borrower */}
    <div className="flex items-center gap-1.5 text-sm">
     <svg className="w-4 h-4 text-text03" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
     </svg>
     <span className="text-text01 font-medium">{loanData.borrower}</span>
    </div>

    {/* Property State */}
    <div className="flex items-center gap-1.5 text-sm">
     <AlertCircle className="w-4 h-4 text-text03" />
     <span className="text-text02">{loanData.propertyState}</span>
    </div>

    {/* SLA Deadline */}
    <div className={`flex items-center gap-1.5 text-sm ${getSLAColor()}`}>
     <Clock className="w-4 h-4" />
     <span className="font-semibold">{getSLAText()}</span>
    </div>

    {/* Loan Amount */}
    <div className="flex items-center gap-1.5 text-sm">
     <svg className="w-4 h-4 text-text03" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
     </svg>
     <span className="text-text01 font-semibold">
      ${loanData.loanAmount?.toLocaleString() || '0'}
     </span>
    </div>

    {/* Status */}
    <div className="flex items-center gap-1.5">
     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
      loanData.status ==="Approved" 
       ?"bg-success01 text-success02"
       : loanData.status ==="Denied"
       ?"bg-error01 text-error02"
       : loanData.status ==="In Underwriting"
       ?"bg-neutral01 text-neutral02"
       : loanData.status ==="Conditional Approval"
       ?"bg-alert01 text-alert02"
       :"bg-bg03 text-text01"
     }`}>
      {loanData.status}
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


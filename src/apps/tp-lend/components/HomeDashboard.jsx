import React, { useState, useEffect } from"react";
import { motion } from"framer-motion";
import { loansAPI } from"../services/api";
import {
 Activity,
 Clock,
 AlertTriangle,
 DollarSign,
 FileText,
 TrendingUp,
 AlertCircle,
 ArrowRight,
 Store,
 Zap,
} from"lucide-react";

export default function HomeDashboard({ onSelectLoan, onNavigate }) {
 const [stats, setStats] = useState({
  totalLoans: 0,
  underReview: 0,
  inUnderwriting: 0,
  conditionalApproval: 0,
  urgentSLA: 0,
  approved: 0,
  totalAmount: 0,
 });
 const [priorityLoans, setPriorityLoans] = useState([]);
 const [anomalies, setAnomalies] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  const loadStats = async () => {
   try {
    const allLoans = await loansAPI.getAll({ page: 1, pageSize: 1000 });
    const loans = allLoans.loans;
    
    const underReview = loans.filter(l => l.status ==="Under Review").length;
    const inUnderwriting = loans.filter(l => l.status ==="In Underwriting").length;
    const conditionalApproval = loans.filter(l => l.status ==="Conditional Approval").length;
    const urgentSLA = loans.filter(l => l.daysUntilSLA !== null && l.daysUntilSLA < 7 && l.daysUntilSLA >= 0).length;
    const approved = loans.filter(l => l.status ==="Approved").length;
    const totalAmount = loans.reduce((sum, l) => sum + (l.loanAmount || 0), 0);
    
    setStats({
     totalLoans: loans.length,
     underReview,
     inUnderwriting,
     conditionalApproval,
     urgentSLA,
     approved,
     totalAmount,
    });

    // Priority queue: loans with high amount and tight SLA first
    const enriched = loans.map((loan) => ({
     ...loan,
     aiPriority:
      (loan.daysUntilSLA !== null ? Math.max(0, 30 - loan.daysUntilSLA) : 10) +
      (loan.loanAmount || 0) / 100000,
    }));

    const topLoans = enriched
     .filter((l) => l.status !=="Approved")
     .sort((a, b) => (b.aiPriority || 0) - (a.aiPriority || 0))
     .slice(0, 5);
    setPriorityLoans(topLoans);

    // Simple anomalies: DTI / policy heavy files approximated via underReview + high amount
    const anomalyCards = [];
    const urgent = loans.filter(
     (l) => l.daysUntilSLA !== null && l.daysUntilSLA < 3 && l.status !=="Approved"
    );
    if (urgent.length) {
     anomalyCards.push({
      id:"urgent-sla",
      title:"Loans at risk of SLA breach",
      description: `${urgent.length} files with less than 3 days to SLA.`,
      severity:"high",
     });
    }
    const jumbo = loans.filter((l) => (l.loanAmount || 0) > 750000);
    if (jumbo.length) {
     anomalyCards.push({
      id:"jumbo-volume",
      title:"High-ticket / jumbo loans in pipeline",
      description: `${jumbo.length} applications above $750K needing closer underwriting oversight.`,
      severity:"medium",
     });
    }
    setAnomalies(anomalyCards);
   } catch (error) {
    console.error("Error loading stats:", error);
   } finally {
    setLoading(false);
   }
  };
  
  loadStats();
 }, []);

 const statCards = [
  {
   title:"Total Loans",
   value: stats.totalLoans,
   icon: FileText,
   gradient:"from-primary to-primary",
  },
  {
   title:"Under Review",
   value: stats.underReview,
   icon: AlertCircle,
   gradient:"from-neutral02 to-neutral02",
  },
  {
   title:"In Underwriting",
   value: stats.inUnderwriting,
   icon: Activity,
   gradient:"from-alert02 to-error02",
  },
  {
   title:"Conditional Approval",
   value: stats.conditionalApproval,
   icon: FileText,
   gradient:"from-alert02 to-alert02",
  },
  {
   title:"Urgent SLA",
   value: stats.urgentSLA,
   icon: Clock,
   gradient:"from-error02 to-alert02",
  },
  {
   title:"Approved",
   value: stats.approved,
   icon: TrendingUp,
   gradient:"from-success02 to-success03",
  },
  {
   title:"Total Loan Volume",
   value: `$${(stats.totalAmount / 1000000).toFixed(1)}M`,
   icon: DollarSign,
   gradient:"from-alert02 to-alert02",
  },
 ];

 if (loading) {
  return (
   <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
   </div>
  );
 }

 const aiSpotlights = [
  {
   title:"Urgent SLA Loans (7 days)",
   value: stats.urgentSLA,
   description:"Applications that will breach underwriting SLAs without intervention.",
  },
  {
   title:"High-Value Pipeline",
   value: `$${Math.max(1, (stats.totalAmount / 1000000).toFixed(1))}M`,
   description:"Total volume in active underwriting where decisions move book-of-business.",
  },
  {
   title:"DTI / Policy Exceptions",
   value: Math.max(2, Math.round(stats.underReview * 0.1)),
   description:"Loans that would benefit most from SOP Executor–driven reasoning.",
  },
 ];

 return (
  <div className="p-6">
   <div className="bg-white rounded-2xl border border-stroke01 shadow-sm p-6 md:p-7">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
     <div className="flex items-center gap-3">
      <div className="p-3 rounded-xl bg-gradient-to-br from-primary via-primary to-neutral02 shadow-lg">
       <Zap className="w-6 h-6 text-white" />
      </div>
      <div>
       <h1 className="text-lg md:text-xl font-bold text-text01">
        AI Watchtower
       </h1>
       <p className="text-xs md:text-sm text-text02 mt-1">
        Live view of underwriting load, SLA risk and book-of-business impact for mortgage workflows.
       </p>
      </div>
     </div>
     <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success01 border border-success010/40 text-[11px] font-medium text-success02">
       <span className="w-2 h-2 rounded-full bg-success010 animate-pulse" />
       Live Demo
      </div>
      {onNavigate && (
       <button
        onClick={() => onNavigate("store")}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text02 hover:text-textLink:text-textLink rounded-lg hover:bg-bg03:bg-text01 transition-colors"
        title="Back to FAB Store"
       >
        <Store className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Store</span>
       </button>
      )}
     </div>
    </div>

    {/* SLA-style risk band, aligned with Cogniclaim */}
    <div className="mb-8">
     <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border-2 border-error01 bg-gradient-to-br from-error01 to-alert01 p-6 shadow-lg"
     >
      <div className="flex items-start justify-between mb-4">
       <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-error01">
         <AlertTriangle className="w-5 h-5 text-error03" />
        </div>
        <div>
         <h3 className="text-lg font-bold text-text01 mb-1">
          SLA Breach & Late Funding Risk – Loans
         </h3>
         <p className="text-sm text-text02">
          Loans whose underwriting / funding timelines put close dates and customer experience at risk.
         </p>
        </div>
       </div>
       <div className="px-3 py-1 rounded-full bg-error01 text-error02 text-xs font-semibold">
        Critical
       </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
       <div className="bg-white/80 rounded-lg p-4 border border-error01">
        <div className="text-xs text-text02 mb-1">Loans Near SLA (7 days)</div>
        <div className="text-2xl font-bold text-error03 mb-1">
         {stats.urgentSLA}
        </div>
        <div className="text-xs text-text03">files at risk of delay</div>
       </div>
       <div className="bg-white/80 rounded-lg p-4 border border-error01">
        <div className="text-xs text-text02 mb-1">In Underwriting</div>
        <div className="text-2xl font-bold text-error03 mb-1">
         {stats.inUnderwriting}
        </div>
        <div className="text-xs text-text03">active underwriting cases</div>
       </div>
       <div className="bg-white/80 rounded-lg p-4 border border-alert01">
        <div className="text-xs text-text02 mb-1">Open Applications</div>
        <div className="text-2xl font-bold text-pinkTP mb-1">
         {stats.totalLoans}
        </div>
        <div className="text-xs text-text03">in current pipeline</div>
       </div>
       <div className="bg-white/80 rounded-lg p-4 border border-alert01">
        <div className="text-xs text-text02 mb-1">Total Loan Volume</div>
        <div className="text-2xl font-bold text-pinkTP mb-1">
         ${((stats.totalAmount || 0) / 1000000).toFixed(1)}M
        </div>
        <div className="text-xs text-text03">exposure in active pipeline</div>
       </div>
      </div>
     </motion.div>
    </div>

    {/* AI-Powered Priority Queue for loans */}
    <div className="mb-8">
     <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 rounded-lg bg-gradient-to-br from-neutral02/20 to-primary/20 border border-neutral02/30">
       <Activity className="w-4 h-4 text-neutral02" />
      </div>
      <h3 className="text-lg font-semibold text-text01">
       AI-Powered Priority Queue
      </h3>
      <span className="text-xs px-2 py-1 rounded-full bg-neutral01 text-neutral02 font-medium">
       🤖 AI Recommended
      </span>
     </div>
     {priorityLoans.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
       {priorityLoans.map((loan, idx) => (
        <motion.div
         key={loan.id}
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: idx * 0.08 }}
         onClick={() => onSelectLoan && onSelectLoan(loan)}
         className="rounded-xl border-2 bg-gradient-to-br from-neutral01 to-bg02 border-neutral02 bg-white/90 backdrop-blur p-4 hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
        >
         <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
           <div className="text-xs font-semibold text-text02 mb-1">
            Priority #{idx + 1}
           </div>
           <div className="text-sm font-bold text-text01 mb-1">
            {loan.loanNumber || loan.id}
           </div>
           <div className="text-xs text-text02">
            {loan.borrower?.name ||"Borrower"}
           </div>
          </div>
          <div className="px-2 py-1 rounded-md text-xs font-bold bg-error01 text-error02">
           {loan.aiPriority?.toFixed(1)}
          </div>
         </div>
         <div className="text-xs font-semibold text-text01 mb-1">
          ${((loan.loanAmount || 0) / 1000).toFixed(0)}K •{""}
          {loan.daysUntilSLA !== null
           ? `${loan.daysUntilSLA}d to SLA`
           :"No SLA set"}
         </div>
         <div className="mt-2 pt-2 border-t border-neutral02">
          <div className="text-xs text-neutral02 font-medium">
           → Open in AI Watchtower
          </div>
         </div>
        </motion.div>
       ))}
      </div>
     ) : (
      <div className="text-center py-6 text-sm text-text03">
       No prioritized loans available right now.
      </div>
     )}
    </div>

    {/* Anomaly Detection for loans */}
    <div className="mb-8">
     <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 rounded-lg bg-gradient-to-br from-textLink/20 to-pinkTP/20 border border-textLink/30">
       <AlertCircle className="w-4 h-4 text-textLink" />
      </div>
      <h3 className="text-lg font-semibold text-text01">
       Anomaly Detection
      </h3>
      <span className="text-xs px-2 py-1 rounded-full bg-error01 text-error02 font-medium">
       🤖 AI Detected
      </span>
     </div>
     {anomalies.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       {anomalies.map((a, idx) => (
        <motion.div
         key={a.id}
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: idx * 0.08 }}
         className={`rounded-xl border-2 bg-gradient-to-br ${
          a.severity ==="high"
           ?"from-error01 to-alert01 border-error03/30"
           :"from-alert01 to-alert01 border-alert02/30"
         } bg-white/90 backdrop-blur p-4 hover:shadow-xl transition-all`}
        >
         <div className="flex items-start justify-between mb-2">
          <div>
           <div className="text-sm font-semibold text-text01 mb-1">
            {a.title}
           </div>
           <p className="text-xs text-text01">
            {a.description}
           </p>
          </div>
         </div>
        </motion.div>
       ))}
      </div>
     ) : (
      <div className="text-center py-6 text-sm text-text03">
       No anomalies detected in the current loan pipeline.
      </div>
     )}
    </div>

    {/* Quick Actions */}
    <div className="mt-2 border-t border-bg03 pt-5">
     <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm md:text-base font-semibold text-text01">
       Jump into underwriting
      </h2>
      <span className="text-[11px] text-text03">
       Choose a path to see AI Reasoning on real loan files
      </span>
     </div>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
       onClick={() => onSelectLoan && onSelectLoan({ id:"new-loan", loanType:"Conventional" })}
       className="p-4 border border-stroke01 rounded-lg hover:border-textLink hover:bg-textLink/5 transition-all text-left"
      >
       <div className="font-semibold text-text01 mb-1 flex items-center gap-2">
        New Application
        <ArrowRight className="w-3 h-3 text-textLink" />
       </div>
       <div className="text-sm text-text02">
        Start a conventional loan and walk through SOP-aware checks.
       </div>
      </button>
      <button
       onClick={() => onSelectLoan && onSelectLoan({ id:"new-fha", loanType:"FHA" })}
       className="p-4 border border-stroke01 rounded-lg hover:border-textLink hover:bg-textLink/5 transition-all text-left"
      >
       <div className="font-semibold text-text01 mb-1 flex items-center gap-2">
        FHA Application
        <ArrowRight className="w-3 h-3 text-textLink" />
       </div>
       <div className="text-sm text-text02">
        Showcase policy-heavy FHA scenarios with bankruptcy / DTI logic.
       </div>
      </button>
      <button
       onClick={() => onNavigate && onNavigate("lend/worklist")}
       className="p-4 border border-stroke01 rounded-lg hover:border-textLink hover:bg-textLink/5 transition-all text-left"
      >
       <div className="font-semibold text-text01 mb-1 flex items-center gap-2">
        Open Worklist
        <ArrowRight className="w-3 h-3 text-textLink" />
       </div>
       <div className="text-sm text-text02">
        Jump into prioritized loans sorted by AI priority and SLA risk.
       </div>
      </button>
     </div>
    </div>
   </div>
  </div>
 );
}


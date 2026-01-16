import { useCallback, useEffect, useMemo, useState } from"react";
import { casesAPI } from"../services/api";
import { Loader2, AlertCircle, RefreshCw, Clock, Sparkles } from"lucide-react";

const HEADERS = [
 { key:"caseNumber", label:"CASE NUMBER" },
 { key:"type", label:"TYPE" },
 { key:"complainant", label:"COMPLAINANT" },
 { key:"issueType", label:"ISSUE TYPE" },
 { key:"status", label:"STATUS" },
 { key:"deadline", label:"DEADLINE" },
 { key:"amount", label:"AMOUNT ($)" },
];

const STATUS_FILTERS = ["All","Filed","Under Investigation","Awaiting Response","Resolved","Escalated"];
const TYPE_FILTERS = ["All","Appeal","Grievance"];
const JURISDICTION_FILTERS = ["All","Federal","State","Internal"];

function DeadlineBadge({ daysUntilDeadline }) {
 if (daysUntilDeadline === undefined || daysUntilDeadline === null) {
  return <span className="text-text03 text-xs">—</span>;
 }
 
 let color ="text-text02";
 let bgColor ="bg-bg03";
 
 if (daysUntilDeadline < 0) {
  color ="text-error02";
  bgColor ="bg-error01";
 } else if (daysUntilDeadline < 7) {
  color ="text-pinkTP";
  bgColor ="bg-alert01";
 } else if (daysUntilDeadline < 14) {
  color ="text-alert02";
  bgColor ="bg-alert01";
 } else {
  color ="text-success03";
  bgColor ="bg-success01";
 }
 
 const text = daysUntilDeadline < 0 
  ? `${Math.abs(daysUntilDeadline)}d overdue`
  : daysUntilDeadline === 0
  ?"Due today"
  : `${daysUntilDeadline}d left`;
 
 return (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color} ${bgColor}`}>
   {text}
  </span>
 );
}

export default function CasesTable({ onSelect }) {
 const [searchInput, setSearchInput] = useState("");
 const [search, setSearch] = useState(""); // Debounced search term
 const [status, setStatus] = useState("All");
 const [type, setType] = useState("All");
 const [jurisdiction, setJurisdiction] = useState("All");
 const [sortKey, setSortKey] = useState("deadline");
 const [sortDir, setSortDir] = useState("asc");
 const [page, setPage] = useState(1);
 const pageSize = 10;

 const [cases, setCases] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [total, setTotal] = useState(0);
 const [totalPages, setTotalPages] = useState(1);
 const [expandedId, setExpandedId] = useState(null);

 // Debounce search: only update search term if input has 3+ chars or is empty
 useEffect(() => {
  const trimmed = searchInput.trim();
  // Only search if empty or has at least 3 characters
  if (trimmed.length === 0 || trimmed.length >= 3) {
   const timer = setTimeout(() => {
    setSearch(trimmed);
    setPage(1); // Reset to first page on new search
   }, 300); // 300ms debounce delay
   return () => clearTimeout(timer);
  }
 }, [searchInput]);

 const fetchCases = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
   const result = await casesAPI.getAll({
    status: status ==="All" ? null : status,
    type: type ==="All" ? null : type,
    jurisdiction: jurisdiction ==="All" ? null : jurisdiction,
    search: search || null,
    page,
    pageSize,
   });
   setCases(result.cases);
   setTotal(result.total);
   setTotalPages(result.totalPages);
  } catch (err) {
   setError(err.message ||"Failed to load cases");
   console.error("Error fetching cases:", err);
  } finally {
   setLoading(false);
  }
 }, [status, type, jurisdiction, search, page, pageSize]);

 useEffect(() => {
  fetchCases();
 }, [fetchCases]);

 const sorted = useMemo(() => {
  return [...cases].sort((a, b) => {
   const A = a[sortKey], B = b[sortKey];
   if (sortKey ==="amount") {
    const numA = typeof A === 'number' ? A : parseFloat(A) || 0;
    const numB = typeof B === 'number' ? B : parseFloat(B) || 0;
    return sortDir ==="asc" ? numA - numB : numB - numA;
   }
   if (sortKey ==="deadline") {
    const daysA = a.daysUntilDeadline ?? Infinity;
    const daysB = b.daysUntilDeadline ?? Infinity;
    return sortDir ==="asc" ? daysA - daysB : daysB - daysA;
   }
   if (sortKey ==="complainant") {
    const nameA = a.complainant?.name ||"";
    const nameB = b.complainant?.name ||"";
    return sortDir ==="asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
   }
   return sortDir ==="asc"
    ? String(A ||"").localeCompare(String(B ||""))
    : String(B ||"").localeCompare(String(A ||""));
  });
 }, [cases, sortKey, sortDir]);

 const handleSort = (key) => {
  if (sortKey === key) {
   setSortDir(sortDir ==="asc" ?"desc" :"asc");
  } else {
   setSortKey(key);
   setSortDir("asc");
  }
 };

 if (loading && cases.length === 0) {
  return (
   <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 animate-spin text-pinkTP" />
   </div>
  );
 }

 if (error) {
  return (
   <div className="flex flex-col items-center justify-center h-64 gap-2">
    <AlertCircle className="w-8 h-8 text-error010" />
    <p className="text-error03">{error}</p>
    <button
     onClick={fetchCases}
     className="px-4 py-2 bg-pinkTP text-white rounded-md hover:bg-pinkTP transition-colors flex items-center gap-2"
    >
     <RefreshCw className="w-4 h-4" />
     Retry
    </button>
   </div>
  );
 }

 return (
  <div className="space-y-4">
   {/* Filters */}
   <div className="flex flex-wrap items-center gap-3">
    <input
     type="text"
     placeholder="Search cases... (min 3 chars)"
     value={searchInput}
     onChange={(e) => setSearchInput(e.target.value)}
     className="px-3 py-2 border border-stroke01 rounded-md bg-white text-sm flex-1 min-w-[200px]"
    />
    <select
     value={status}
     onChange={(e) => setStatus(e.target.value)}
     className="px-3 py-2 border border-stroke01 rounded-md bg-white text-sm"
    >
     {STATUS_FILTERS.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
    <select
     value={type}
     onChange={(e) => setType(e.target.value)}
     className="px-3 py-2 border border-stroke01 rounded-md bg-white text-sm"
    >
     {TYPE_FILTERS.map(t => <option key={t} value={t}>{t}</option>)}
    </select>
    <select
     value={jurisdiction}
     onChange={(e) => setJurisdiction(e.target.value)}
     className="px-3 py-2 border border-stroke01 rounded-md bg-white text-sm"
    >
     {JURISDICTION_FILTERS.map(j => <option key={j} value={j}>{j}</option>)}
    </select>
   </div>

   {/* Table */}
   <div className="bg-white rounded-lg border border-stroke01 overflow-hidden">
    <div className="overflow-x-auto">
     <table className="w-full">
      <thead className="bg-bg02 border-b border-stroke01">
       <tr>
        {HEADERS.map(header => (
         <th
          key={header.key}
          onClick={() => handleSort(header.key)}
          className="px-4 py-3 text-left text-xs font-semibold text-text01 uppercase tracking-wider cursor-pointer hover:bg-bg03:bg-text01"
         >
          <div className="flex items-center gap-1">
           {header.label}
           {sortKey === header.key && (
            <span className="text-pinkTP">{sortDir ==="asc" ?"↑" :"↓"}</span>
           )}
          </div>
         </th>
        ))}
       </tr>
      </thead>
      <tbody className="divide-y divide-stroke01">
       {sorted.map((caseData) => (
        <>
         <tr
          key={caseData.id}
          onClick={() =>
           setSortDir((prev) => {
            // reuse expandedId state to toggle row expansion
            setExpandedId((prevId) => (prevId === caseData.id ? null : caseData.id));
            return prev;
           })
          }
          className="hover:bg-bg02:bg-text01 cursor-pointer transition-colors"
         >
          <td className="px-4 py-3 text-sm font-medium text-text01">
           <div className="flex items-center gap-2">
            <span>{caseData.caseNumber}</span>
            {Array.isArray(caseData.lineItems) && caseData.lineItems.length > 0 && (
             <button
              type="button"
              onClick={(e) => {
               e.stopPropagation();
               setExpandedId((prev) => (prev === caseData.id ? null : caseData.id));
              }}
              className="text-[11px] px-2 py-0.5 rounded-full bg-bg03 text-text01 border border-stroke01"
             >
              {caseData.lineItems.length} line item{caseData.lineItems.length > 1 ?"s" :""}
             </button>
            )}
            <button
             type="button"
             onClick={(e) => {
              e.stopPropagation();
              onSelect?.(caseData);
             }}
             className="inline-flex items-center justify-center text-[11px] px-2 py-0.5 rounded-full bg-white text-pinkTP border border-pinkTP/20 hover:bg-tertiary:bg-pinkTP/30"
             title="Open in AI Reasoning"
            >
             <Sparkles className="w-3.5 h-3.5" />
             <span className="sr-only">Open in AI Reasoning</span>
            </button>
           </div>
          </td>
          <td className="px-4 py-3 text-sm">
           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            caseData.type ==="Appeal"
             ?"bg-neutral01 text-neutral02"
             :"bg-pinkTP/20 text-textLink"
           }`}>
            {caseData.type}
           </span>
          </td>
          <td className="px-4 py-3 text-sm text-text01">
           {caseData.complainant?.name}
          </td>
          <td className="px-4 py-3 text-sm text-text02">
           {caseData.issueType}
          </td>
          <td className="px-4 py-3 text-sm">
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
          </td>
          <td className="px-4 py-3 text-sm">
           <DeadlineBadge daysUntilDeadline={caseData.daysUntilDeadline} />
          </td>
          <td className="px-4 py-3 text-sm font-semibold text-text01">
           ${caseData.amount?.toLocaleString() || '0'}
          </td>
         </tr>
         {expandedId === caseData.id && Array.isArray(caseData.lineItems) && caseData.lineItems.length > 0 && (
          <tr key={`${caseData.id}-lines`} className="bg-bg02/60">
           <td colSpan={HEADERS.length} className="px-6 pb-4 pt-0">
            <div className="mt-1 border border-stroke01 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
             <table className="w-full text-xs">
              <thead className="bg-bg03">
               <tr>
                <th className="px-2 py-1 text-left font-medium text-text02">Line</th>
                <th className="px-2 py-1 text-left font-medium text-text02">Description</th>
                <th className="px-2 py-1 text-left font-medium text-text02">Issue Type</th>
                <th className="px-2 py-1 text-left font-medium text-text02">Amount</th>
                <th className="px-2 py-1 text-left font-medium text-text02">Status</th>
               </tr>
              </thead>
              <tbody className="divide-y divide-bg03">
               {caseData.lineItems.map((li) => (
                <tr
                 key={li.lineId}
                 className="hover:bg-bg02:bg-text01/70 cursor-pointer"
                 onClick={(e) => {
                  e.stopPropagation();
                  // Open parent case; line-level next steps are then available in details panel
                  onSelect?.(caseData);
                 }}
                >
                 <td className="px-2 py-1 font-medium text-text01">{li.lineId}</td>
                 <td className="px-2 py-1 text-text01">{li.description}</td>
                 <td className="px-2 py-1 text-text01">{li.issueType}</td>
                 <td className="px-2 py-1 text-text01">
                  {li.amount != null ? `$${li.amount.toLocaleString()}` :"—"}
                 </td>
                 <td className="px-2 py-1">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-bg03 text-text01">
                   {li.status || caseData.status}
                  </span>
                 </td>
                </tr>
               ))}
              </tbody>
             </table>
            </div>
           </td>
          </tr>
         )}
        </>
       ))}
      </tbody>
     </table>
    </div>
   </div>

   {/* Pagination */}
   {totalPages > 1 && (
    <div className="flex items-center justify-between">
     <div className="text-sm text-text02">
      Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} cases
     </div>
     <div className="flex gap-2">
      <button
       onClick={() => setPage(p => Math.max(1, p - 1))}
       disabled={page === 1}
       className="px-3 py-1 border border-stroke01 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
       Previous
      </button>
      <button
       onClick={() => setPage(p => Math.min(totalPages, p + 1))}
       disabled={page === totalPages}
       className="px-3 py-1 border border-stroke01 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
       Next
      </button>
     </div>
    </div>
   )}
  </div>
 );
}


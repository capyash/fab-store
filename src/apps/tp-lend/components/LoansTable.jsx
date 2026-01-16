import { useCallback, useEffect, useMemo, useState } from"react";
import { loansAPI } from"../services/api";
import { Loader2, AlertCircle, RefreshCw, Clock, Sparkles } from"lucide-react";

const HEADERS = [
 { key:"loanNumber", label:"LOAN NUMBER" },
 { key:"loanType", label:"LOAN TYPE" },
 { key:"borrower", label:"BORROWER" },
 { key:"propertyState", label:"STATE" },
 { key:"status", label:"STATUS" },
 { key:"sla", label:"SLA" },
 { key:"loanAmount", label:"AMOUNT ($)" },
];

const STATUS_FILTERS = ["All","Under Review","Pending Documentation","In Underwriting","Conditional Approval","Approved","Denied"];
const LOAN_TYPE_FILTERS = ["All","Conventional","FHA","VA","USDA","Jumbo"];
const STATE_FILTERS = ["All","TX","CA","FL","NY","IL","PA","OH","GA","NC","MI"];

function SLABadge({ daysUntilSLA }) {
 if (daysUntilSLA === undefined || daysUntilSLA === null) {
  return <span className="text-text03 text-xs">—</span>;
 }
 
 let color ="text-text02";
 let bgColor ="bg-bg03";
 
 if (daysUntilSLA < 0) {
  color ="text-error02";
  bgColor ="bg-error01";
 } else if (daysUntilSLA < 7) {
  color ="text-pinkTP";
  bgColor ="bg-alert01";
 } else if (daysUntilSLA < 14) {
  color ="text-alert02";
  bgColor ="bg-alert01";
 } else {
  color ="text-success03";
  bgColor ="bg-success01";
 }
 
 const text = daysUntilSLA < 0 
  ? `${Math.abs(daysUntilSLA)}d overdue`
  : daysUntilSLA === 0
  ?"Due today"
  : `${daysUntilSLA}d left`;
 
 return (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color} ${bgColor}`}>
   {text}
  </span>
 );
}

export default function LoansTable({ onSelect }) {
 const [searchInput, setSearchInput] = useState("");
 const [search, setSearch] = useState(""); // Debounced search term
 const [status, setStatus] = useState("All");
 const [loanType, setLoanType] = useState("All");
 const [propertyState, setPropertyState] = useState("All");
 const [sortKey, setSortKey] = useState("sla");
 const [sortDir, setSortDir] = useState("asc");
 const [page, setPage] = useState(1);
 const pageSize = 10;

 const [loans, setLoans] = useState([]);
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

 const fetchLoans = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
   const result = await loansAPI.getAll({
    status: status ==="All" ? null : status,
    loanType: loanType ==="All" ? null : loanType,
    propertyState: propertyState ==="All" ? null : propertyState,
    search: search || null,
    page,
    pageSize,
   });
   setLoans(result.loans);
   setTotal(result.total);
   setTotalPages(result.totalPages);
  } catch (err) {
   setError(err.message ||"Failed to load loans");
   console.error("Error fetching loans:", err);
  } finally {
   setLoading(false);
  }
 }, [status, loanType, propertyState, search, page, pageSize]);

 useEffect(() => {
  fetchLoans();
 }, [fetchLoans]);

 const sorted = useMemo(() => {
  return [...loans].sort((a, b) => {
   const A = a[sortKey], B = b[sortKey];
   if (sortKey ==="loanAmount") {
    const numA = typeof A === 'number' ? A : parseFloat(A) || 0;
    const numB = typeof B === 'number' ? B : parseFloat(B) || 0;
    return sortDir ==="asc" ? numA - numB : numB - numA;
   }
   if (sortKey ==="sla") {
    const daysA = a.daysUntilSLA ?? Infinity;
    const daysB = b.daysUntilSLA ?? Infinity;
    return sortDir ==="asc" ? daysA - daysB : daysB - daysA;
   }
   if (sortKey ==="borrower") {
    const nameA = a.borrower ||"";
    const nameB = b.borrower ||"";
    return sortDir ==="asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
   }
   return sortDir ==="asc"
    ? String(A ||"").localeCompare(String(B ||""))
    : String(B ||"").localeCompare(String(A ||""));
  });
 }, [loans, sortKey, sortDir]);

 const handleSort = (key) => {
  if (sortKey === key) {
   setSortDir(sortDir ==="asc" ?"desc" :"asc");
  } else {
   setSortKey(key);
   setSortDir("asc");
  }
 };

 if (loading && loans.length === 0) {
  return (
   <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 animate-spin text-pinkTP" />
   </div>
  );
 }

 return (
  <div className="space-y-4">
   {/* Filters */}
   <div className="flex flex-wrap items-center gap-3">
    <input
     type="text"
     value={searchInput}
     onChange={(e) => setSearchInput(e.target.value)}
     placeholder="Search loans (min 3 chars)..."
     className="flex-1 min-w-[200px] px-4 py-2 border border-stroke01 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pinkTP"
    />
    <select
     value={status}
     onChange={(e) => {
      setStatus(e.target.value);
      setPage(1);
     }}
     className="px-3 py-2 border border-stroke01 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pinkTP"
    >
     {STATUS_FILTERS.map((s) => (
      <option key={s} value={s}>
       {s}
      </option>
     ))}
    </select>
    <select
     value={loanType}
     onChange={(e) => {
      setLoanType(e.target.value);
      setPage(1);
     }}
     className="px-3 py-2 border border-stroke01 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pinkTP"
    >
     {LOAN_TYPE_FILTERS.map((t) => (
      <option key={t} value={t}>
       {t}
      </option>
     ))}
    </select>
    <select
     value={propertyState}
     onChange={(e) => {
      setPropertyState(e.target.value);
      setPage(1);
     }}
     className="px-3 py-2 border border-stroke01 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pinkTP"
    >
     {STATE_FILTERS.map((s) => (
      <option key={s} value={s}>
       {s}
      </option>
     ))}
    </select>
   </div>

   {/* Error State */}
   {error && (
    <div className="flex items-start gap-3 p-4 bg-error01 border border-error01 rounded-lg">
     <AlertCircle className="w-5 h-5 text-error03 flex-shrink-0 mt-0.5" />
     <div className="flex-1">
      <p className="text-sm font-medium text-error02">{error}</p>
      <button
       onClick={fetchLoans}
       className="mt-2 text-xs text-error03 hover:underline flex items-center gap-1"
      >
       <RefreshCw className="w-3 h-3" />
       Try again
      </button>
     </div>
    </div>
   )}

   {/* Loading State */}
   {loading && !error && (
    <div className="flex flex-col items-center justify-center py-16 px-6">
     <Loader2 className="w-8 h-8 text-pinkTP animate-spin mb-3" />
     <p className="text-sm text-text03">Loading loans...</p>
    </div>
   )}

   {/* Table */}
   {!loading && !error && (
    <>
     <div className="overflow-x-auto">
      <table className="w-full text-sm">
       <thead className="bg-bg02 text-text02 text-[11px] font-semibold tracking-wide">
        <tr>
         {HEADERS.map((h) => (
          <th
           key={h.key}
           onClick={() => handleSort(h.key)}
           className={`text-left px-4 py-3 cursor-pointer select-none hover:bg-bg03:bg-text01/50 transition`}
           title="Click to sort"
          >
           {h.label}
           {sortKey === h.key ? (sortDir ==="asc" ?" ▲" :" ▼") :""}
          </th>
         ))}
        </tr>
       </thead>
       <tbody className="divide-y divide-bg03">
        {sorted.map((loan) => (
         <>
          <tr
           key={loan.id}
           className="hover:bg-bg02:bg-text01/30 transition-colors cursor-pointer"
           onClick={() =>
            setExpandedId((prev) => (prev === loan.id ? null : loan.id))
           }
          >
           <td className="px-4 py-3 font-medium text-text01">
            <div className="flex items-center gap-2">
             <span>{loan.loanNumber}</span>
             {Array.isArray(loan.lineItems) && loan.lineItems.length > 0 && (
              <button
               type="button"
               onClick={(e) => {
                e.stopPropagation();
                setExpandedId((prev) => (prev === loan.id ? null : loan.id));
               }}
               className="text-[11px] px-2 py-0.5 rounded-full bg-bg03 text-text01 border border-stroke01"
              >
               {loan.lineItems.length} line item{loan.lineItems.length > 1 ?"s" :""}
              </button>
             )}
             <button
              type="button"
              onClick={(e) => {
               e.stopPropagation();
               onSelect?.(loan);
              }}
              className="inline-flex items-center justify-center text-[11px] px-2 py-0.5 rounded-full bg-white text-pinkTP border border-pinkTP/20 hover:bg-tertiary:bg-pinkTP/30"
              title="Open in AI Reasoning"
             >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="sr-only">Open in AI Reasoning</span>
             </button>
            </div>
           </td>
           <td className="px-4 py-3">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
             loan.loanType ==="FHA" 
              ?"bg-neutral01 text-neutral02"
              : loan.loanType ==="VA"
              ?"bg-success01 text-success02"
              : loan.loanType ==="Jumbo"
              ?"bg-pinkTP/20 text-textLink"
              :"bg-bg03 text-text01"
            }`}>
             {loan.loanType}
            </span>
           </td>
           <td className="px-4 py-3 text-text01">{loan.borrower}</td>
           <td className="px-4 py-3 text-text02">{loan.propertyState}</td>
           <td className="px-4 py-3">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
             loan.status ==="Approved" 
              ?"bg-success01 text-success02"
              : loan.status ==="Denied"
              ?"bg-error01 text-error02"
              : loan.status ==="In Underwriting"
              ?"bg-neutral01 text-neutral02"
              : loan.status ==="Conditional Approval"
              ?"bg-alert01 text-alert02"
              :"bg-bg03 text-text01"
            }`}>
             {loan.status}
            </span>
           </td>
           <td className="px-4 py-3">
            <SLABadge daysUntilSLA={loan.daysUntilSLA} />
           </td>
           <td className="px-4 py-3 font-medium text-text01">
            ${loan.loanAmount?.toLocaleString() || '0'}
           </td>
          </tr>
          {expandedId === loan.id && Array.isArray(loan.lineItems) && loan.lineItems.length > 0 && (
           <tr key={`${loan.id}-lines`} className="bg-bg02/60">
            <td colSpan={HEADERS.length} className="px-6 pb-4 pt-0">
             <div className="mt-1 border border-stroke01 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
               <thead className="bg-bg03">
                <tr>
                 <th className="px-2 py-1 text-left font-medium text-text02">Line</th>
                 <th className="px-2 py-1 text-left font-medium text-text02">Description</th>
                 <th className="px-2 py-1 text-left font-medium text-text02">Amount</th>
                 <th className="px-2 py-1 text-left font-medium text-text02">Status</th>
                </tr>
               </thead>
               <tbody className="divide-y divide-bg03">
                {loan.lineItems.map((li) => (
                 <tr
                  key={li.lineId}
                  className="hover:bg-bg02:bg-text01/70 cursor-pointer"
                  onClick={(e) => {
                   e.stopPropagation();
                   onSelect?.(loan);
                  }}
                 >
                  <td className="px-2 py-1 font-medium text-text01">{li.lineId}</td>
                  <td className="px-2 py-1 text-text01">{li.description}</td>
                  <td className="px-2 py-1 text-text01">${li.amount?.toLocaleString() || '0'}</td>
                  <td className="px-2 py-1">
                   <span className={`px-2 py-0.5 rounded text-xs ${
                    li.status ==="Approved"
                     ?"bg-success01 text-success02"
                     : li.status ==="Rejected"
                     ?"bg-error01 text-error02"
                     :"bg-bg03 text-text01"
                   }`}>
                    {li.status}
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

     {/* Pagination */}
     {totalPages > 1 && (
      <div className="flex items-center justify-between px-4 py-3 border-t border-stroke01">
       <div className="text-sm text-text02">
        Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total} loans
       </div>
       <div className="flex items-center gap-2">
        <button
         onClick={() => setPage((p) => Math.max(1, p - 1))}
         disabled={page === 1}
         className="px-3 py-1.5 text-sm border border-stroke01 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg02:bg-text01"
        >
         Previous
        </button>
        <span className="text-sm text-text02">
         Page {page} of {totalPages}
        </span>
        <button
         onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
         disabled={page === totalPages}
         className="px-3 py-1.5 text-sm border border-stroke01 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg02:bg-text01"
        >
         Next
        </button>
       </div>
      </div>
     )}
    </>
   )}
  </div>
 );
}


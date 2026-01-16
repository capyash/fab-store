import { useCallback, useEffect, useMemo, useState } from "react";
import { claimsAPI } from "../services/api";
import StatusPill from "./StatusPill";
import { Loader2, AlertCircle, RefreshCw, Sparkles } from "lucide-react";

const HEADERS = [
  { key: "id", label: "CLAIM ID" },
  { key: "member", label: "MEMBER" },
  { key: "provider", label: "PROVIDER" },
  { key: "status", label: "STATUS" },
  { key: "amount", label: "AMOUNT ($)" },
  { key: "date", label: "RECEIVED DATE" },
  { key: "aiPriority", label: "AI PRIORITY" },
];

const STATUS_FILTERS = ["All", "Pending Review", "Under Process", "Information Needed", "Escalated"];

// AI Priority indicator component
function AIPriorityBadge({ score }) {
  if (!score && score !== 0) return <span className="text-text03 text-xs">—</span>;

  const numScore = typeof score === 'string' ? parseFloat(score) : score;

  let color = "text-text03";
  let dotColor = "bg-text03";

  if (numScore >= 8.0) {
    color = "text-error02";
    dotColor = "bg-error03";
  } else if (numScore >= 7.0) {
    color = "text-alert02";
    dotColor = "bg-alert02";
  } else if (numScore >= 6.0) {
    color = "text-alert02";
    dotColor = "bg-alert02";
  } else if (numScore >= 5.0) {
    color = "text-success02";
    dotColor = "bg-success03";
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-bold ${color}`}>{numScore.toFixed(1)}</span>
      <div className={`w-2 h-2 rounded-full ${dotColor}`} />
    </div>
  );
}

export default function ClaimsTable({ onSelect }) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState(""); // Debounced search term
  const [status, setStatus] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [expandedId, setExpandedId] = useState(null);

  // API state
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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

  // Fetch claims from API
  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await claimsAPI.getAll({
        status: status === "All" ? null : status,
        search: search || null,
        page,
        pageSize,
      });
      setClaims(result.claims);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err.message || "Failed to load claims");
      console.error("Error fetching claims:", err);
    } finally {
      setLoading(false);
    }
  }, [status, search, page, pageSize]);

  // Fetch claims when filters change
  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  // Client-side sorting
  const sorted = useMemo(() => {
    return [...claims].sort((a, b) => {
      const A = a[sortKey], B = b[sortKey];
      if (sortKey === "amount" || sortKey === "aiPriority") {
        const numA = typeof A === 'number' ? A : parseFloat(A) || 0;
        const numB = typeof B === 'number' ? B : parseFloat(B) || 0;
        return sortDir === "asc" ? numA - numB : numB - numA;
      }
      return sortDir === "asc"
        ? String(A).localeCompare(String(B))
        : String(B).localeCompare(String(A));
    });
  }, [claims, sortKey, sortDir]);

  // Calculate AI insights
  const aiInsights = useMemo(() => {
    const highPriority = claims.filter(c => (c.aiPriority || 0) >= 8.0).length;
    const highPriorityPercent = claims.length > 0 ? Math.round((highPriority / claims.length) * 100) : 0;
    const escalationRisk = claims.filter(c => c.status === "Escalated" || (c.aiPriority || 0) >= 8.5).length;
    const escalationPercent = claims.length > 0 ? Math.round((escalationRisk / claims.length) * 100) : 0;
    
    return { highPriority, highPriorityPercent, escalationRisk, escalationPercent };
  }, [claims]);

  const toggleSort = (key) => {
    if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
  };

  return (
    <div className="bg-bg01 rounded-xl border border-stroke01 shadow-sm overflow-hidden">
      {/* AI Smart Filters */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-text01">AI Smart Filters</span>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral01 text-primary border border-primary/30 text-xs font-medium hover:bg-primary/10 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High Priority ({aiInsights.highPriority})</span>
            <span className="ml-0.5 opacity-75">({aiInsights.highPriorityPercent}%)</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-error01 text-error02 border border-error03 text-xs font-medium hover:bg-error03/10 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Escalation Risk ({aiInsights.escalationRisk})</span>
            <span className="ml-0.5 opacity-75">({aiInsights.escalationPercent}%)</span>
          </button>
        </div>
      </div>

      {/* Status Tabs and Search */}
      <div className="flex items-center justify-between gap-4 px-6 pb-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              disabled={loading}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors font-medium ${
                status === s
                  ? "bg-select text-text01"
                  : "bg-bg01 hover:bg-hover text-text01 border border-stroke01"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <input
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by ID, Member, Provider, Status (min 3 chars)"
          disabled={loading}
          className="border border-stroke01 bg-bg01 rounded-lg px-4 py-2 text-sm w-80 disabled:opacity-50 text-text01 placeholder-text03 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="mx-6 mb-4 p-4 bg-error01 border border-error03 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-error02 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-error02">{error}</p>
            <button
              onClick={fetchClaims}
              className="mt-2 text-xs text-error02 hover:underline flex items-center gap-1"
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
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
          <p className="text-sm text-text03">Loading claims...</p>
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
                      onClick={() => h.key !== 'date' && toggleSort(h.key)}
                      className={`text-left px-4 py-3 ${h.key !== 'date' ? 'cursor-pointer select-none hover:bg-hover' : ''} transition`}
                      title={h.key !== 'date' ? "Click to sort" : ""}
                    >
                      {h.label}
                      {sortKey === h.key && h.key !== 'date' ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke01">
                {sorted.map((c) => (
                  <>
                    <tr
                      key={c.id}
                      className="hover:bg-hover transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedId((prev) => (prev === c.id ? null : c.id))
                      }
                    >
                      <td className="px-4 py-3 font-medium text-text01">
                        <div className="flex items-center gap-2">
                          <span>{c.id}</span>
                          {Array.isArray(c.lineItems) && c.lineItems.length > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedId((prev) => (prev === c.id ? null : c.id));
                              }}
                              className="text-[11px] px-2 py-0.5 rounded-full bg-bg02 text-text01 border border-stroke01"
                            >
                              {c.lineItems.length} line item{c.lineItems.length > 1 ? "s" : ""}
                            </button>
                          )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect?.(c);
                          }}
                          className="inline-flex items-center justify-center text-[11px] px-2 py-0.5 rounded-full bg-bg01 text-primary border border-primary/40 hover:bg-primary/10"
                          title="Open in AI Reasoning"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="sr-only">Open in AI Reasoning</span>
                        </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text01">{c.member}</td>
                      <td className="px-4 py-3 text-text03">{c.provider}</td>
                      <td className="px-4 py-3">
                        <StatusPill status={c.status} />
                      </td>
                      <td className="px-4 py-3 font-medium text-text01">{c.amount?.toLocaleString() || '0'}</td>
                      <td className="px-4 py-3 text-text03">{c.date}</td>
                      <td className="px-4 py-3">
                        <AIPriorityBadge score={c.aiPriority} />
                      </td>
                    </tr>
                    {expandedId === c.id && Array.isArray(c.lineItems) && c.lineItems.length > 0 && (
                      <tr key={`${c.id}-lines`} className="bg-bg02">
                        <td colSpan={HEADERS.length} className="px-6 pb-4 pt-0">
                          <div className="mt-1 border border-stroke01 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                            <table className="w-full text-xs">
                              <thead className="bg-bg03">
                                <tr>
                                  <th className="px-2 py-1 text-left font-medium text-text02">Line</th>
                                  <th className="px-2 py-1 text-left font-medium text-text02">Description</th>
                                  <th className="px-2 py-1 text-left font-medium text-text02">CPT</th>
                                  <th className="px-2 py-1 text-left font-medium text-text02">ICD‑10</th>
                                  <th className="px-2 py-1 text-left font-medium text-text02">Amount</th>
                                  <th className="px-2 py-1 text-left font-medium text-text02">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stroke01">
                                {c.lineItems.map((li) => (
                                  <tr
                                    key={li.lineId}
                                    className="hover:bg-hover cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Surface the parent claim in the side panel; line-level next steps are shown in details panel
                                      onSelect?.(c);
                                    }}
                                  >
                                    <td className="px-2 py-1 font-medium text-text01">{li.lineId}</td>
                                    <td className="px-2 py-1 text-text01">{li.description}</td>
                                    <td className="px-2 py-1 text-text01">{li.cptCode}</td>
                                    <td className="px-2 py-1 text-text01">{li.icd10Code}</td>
                                    <td className="px-2 py-1 text-text01">
                                      {li.amount != null ? `$${li.amount.toLocaleString()}` : "—"}
                                    </td>
                                    <td className="px-2 py-1">
                                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-bg02 text-text01">
                                        {li.status || c.status}
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
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={HEADERS.length} className="px-4 py-12 text-center text-text03">
                      No matching claims found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-stroke01 bg-bg02">
            <div className="text-xs text-text03">
              Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total} claims
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-md border border-stroke01 bg-bg01 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-hover transition-colors text-text01"
              >
                Previous
              </button>
              <span className="text-xs text-text01 px-2">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-md border border-stroke01 bg-bg01 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-hover transition-colors text-text01"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

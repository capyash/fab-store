export default function StatusPill({ status, value }) {
  const statusText = status || value;
  const map = {
  "Pending Review": "bg-alert01 text-yellow-800",
  "Under Process": "bg-neutral01 text-blue-800",
  "Information Needed":"bg-alert01 text-orange-800",
  "Escalated":   "bg-error01 text-error02",
  "Approved":    "bg-success01 text-green-800",
  "Rejected":    "bg-stroke01 text-text01",
  };
  const cls = map[statusText] ||"bg-bg03 text-text01";
  return <span className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${cls}`}>{statusText}</span>;
 }
 
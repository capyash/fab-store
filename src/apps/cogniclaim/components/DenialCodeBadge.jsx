import { AlertCircle } from"lucide-react";

/**
 * Denial Code Badge Component
 * Displays denial codes with descriptions
 */
export default function DenialCodeBadge({ code, description, className ="" }) {
 return (
  <div
   className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-error01 border border-error01 text-error02 text-xs font-medium ${className}`}
   title={description}
  >
   <AlertCircle className="w-3 h-3" />
   <span className="font-semibold">{code}</span>
   {description && (
    <span className="hidden sm:inline text-error02">
     {description}
    </span>
   )}
  </div>
 );
}


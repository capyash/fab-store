/**
 * AppLogo Component
 * Dynamic logo component matching the TP.ai FAB Retail design exactly
 * 
 * All logos use the same layout:
 * - Text block: "TP.ai FAB" (top) + App Name™ (bottom)
 * - Icon on RIGHT (optional): Three stacked rounded rectangles with gradient
 * 
 * Only the second line (app name) changes between applications
 * 
 * @param {string} appName - Application name to display
 * @param {string} className - CSS classes for sizing
 * @param {boolean} showIcon - Whether to show the three stacked rectangles icon (default: false)
 */

export default function AppLogo({ 
  appName = "Retail", 
  className = "h-9",
  showIcon = false
}) {
  // Clean app name: remove "TP " prefix if present
  const displayName = appName.replace(/^TP\s+/i, "");
  
  return (
    <div className={`flex items-center ${showIcon ? 'gap-3' : ''} ${className}`}>
      {/* Text block: TP.ai FAB and Application Name */}
      <div className="flex flex-col leading-none">
        {/* Top line: TP.ai FAB - smaller, bold, uppercase TP and FAB, lowercase .ai (about half the height of bottom line) */}
        <div className="text-[13px] font-bold text-text01 tracking-tight mb-1">
          <span className="uppercase">TP</span>
          <span className="lowercase">.ai</span>
          <span className="uppercase"> FAB</span>
        </div>
        {/* Bottom line: Application Name with ™ - much larger, bold, uppercase (dominant size) */}
        <div className="flex items-baseline gap-0.5">
          <span className="text-[26px] font-bold text-text01 leading-none tracking-tight uppercase">
            {displayName}
          </span>
          <span className="text-[9px] font-normal text-text01 leading-none align-super -mt-1">
            ™
          </span>
        </div>
      </div>

      {/* Icon: Three stacked rounded rectangles with gradient - only shown if showIcon is true */}
      {showIcon && (
        <div className="relative flex-shrink-0">
          <div className="relative w-[32px] h-[32px]">
            {/* Top layer - dark grey/muted purple */}
            <div className="absolute top-0 left-0 w-[24px] h-[16px] rounded-icon16 bg-linear-to-br from-text02/90 to-primary/80 shadow-sm" />
            {/* Middle layer - vibrant purple */}
            <div className="absolute top-2 left-1 w-[24px] h-[16px] rounded-icon16 bg-linear-to-br from-primary to-primary/80 shadow-sm" />
            {/* Bottom layer - light grey/pale purple */}
            <div className="absolute top-4 left-2 w-[24px] h-[16px] rounded-icon16 bg-linear-to-br from-tertiary/90 to-stroke01/80 shadow-drop" />
          </div>
        </div>
      )}
    </div>
  );
}

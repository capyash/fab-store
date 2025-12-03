import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import CaseContextBar from "./CaseContextBar";
import UnifiedAIConsole from "./UnifiedAIConsole";
import SOPReferencePanel from "../../cogniclaim/components/SOPReferencePanel";
import { SOPViewer } from "./platformComponents";

export default function AIHub({ case: caseData, onBack }) {
  const [sopOpen, setSopOpen] = useState(false);
  const [activeRefs, setActiveRefs] = useState([]);
  
  // SOP Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerSopId, setViewerSopId] = useState(null);
  const [viewerScenario, setViewerScenario] = useState(null);
  const [viewerStepIndex, setViewerStepIndex] = useState(null);

  const handleSOPView = (sopId, scenario, caseStatus, stepIndex) => {
    setViewerSopId(sopId);
    setViewerScenario(scenario || caseData?.scenario);
    setViewerStepIndex(stepIndex);
    setViewerOpen(true);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Top context bar */}
      <CaseContextBar
        caseData={caseData}
        onBack={onBack}
        onToggleSop={() => setSopOpen((v) => !v)}
        sopOpen={sopOpen}
      />
      
      {/* Main content area with SOP drawer on right */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Main console - takes full width when SOP closed */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <UnifiedAIConsole
            case={caseData}
            caseId={caseData?.id}
            onSOPView={handleSOPView}
            onSOPReference={setActiveRefs}
          />
        </div>

        {/* SOP Reference Panel - Right side drawer (overlays when open) */}
        <SOPReferencePanel
          claim={caseData} // Reuse Cogniclaim's SOPReferencePanel (it accepts generic item)
          activeRefs={activeRefs}
          isOpen={sopOpen}
          onClose={() => setSopOpen(false)}
          onOpenViewer={handleSOPView}
        />
      </div>

      {/* SOP Document Viewer Modal */}
      <AnimatePresence>
        {viewerOpen && (
          <SOPViewer
            sopId={viewerSopId}
            stepIndex={viewerStepIndex}
            scenario={viewerScenario}
            caseStatus={caseData?.status}
            onClose={() => {
              setViewerOpen(false);
              setViewerSopId(null);
              setViewerScenario(null);
              setViewerStepIndex(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


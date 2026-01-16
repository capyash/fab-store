import { ArrowLeft, FileText, Package } from"lucide-react";
import { motion } from"framer-motion";

export default function WorkOrderContextBar({ workOrder, onBack, onToggleReference, referenceOpen }) {
 return (
  <div className="px-6 py-4 border-b border-stroke01 bg-white">
   <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
     <button
      onClick={onBack}
      className="p-2 rounded-lg hover:bg-bg03 transition-colors"
     >
      <ArrowLeft className="w-5 h-5 text-text02" />
     </button>
     <div>
      <h2 className="text-lg font-semibold text-text01">
       {workOrder?.id ||"Work Order"}
      </h2>
      <p className="text-sm text-text02">
       {workOrder?.serviceType ||"Field Service"} • {workOrder?.status ||"Pending"}
      </p>
     </div>
    </div>
    <button
     onClick={onToggleReference}
     className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      referenceOpen
       ?"bg-primary text-white"
       :"bg-bg03 text-text01 hover:bg-stroke01"
     }`}
    >
     <Package className="w-4 h-4 inline mr-2" />
     {referenceOpen ?"Hide" :"Show"} References
    </button>
   </div>
  </div>
 );
}


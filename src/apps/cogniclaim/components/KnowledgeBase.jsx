import { useState, useMemo, useEffect } from"react";
import { Search, BookOpen, FileText, MapPin, Tag, ChevronRight, X, Grid, List as ListIcon, Brain, Sparkles, Store } from"lucide-react";
import { motion, AnimatePresence } from"framer-motion";
import { SCENARIO_SOPS, SOP_INDEX, getAllHealthcareSOPs } from"../data/sops";
import { aiAPI } from"../services/api";
import { SOPViewer } from"./platformComponents";

/**
 * Knowledge Base Component
 * Displays all SOPs in a searchable, filterable interface
 */
export default function KnowledgeBase({ onNavigate }) {
 const [searchTerm, setSearchTerm] = useState("");
 const [selectedCategory, setSelectedCategory] = useState("All");
 const [selectedState, setSelectedState] = useState("All");
 const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
 const [selectedSOP, setSelectedSOP] = useState(null);
 const [viewerOpen, setViewerOpen] = useState(false);
 const [useSemanticSearch, setUseSemanticSearch] = useState(false);
 const [semanticResults, setSemanticResults] = useState([]);
 const [loadingSemantic, setLoadingSemantic] = useState(false);
 const [contextualSuggestions, setContextualSuggestions] = useState([]);

 // Get all SOPs
 const allSOPs = useMemo(() => {
  const sops = [];
  
  // Add scenario SOPs
  Object.entries(SCENARIO_SOPS).forEach(([key, sop]) => {
   sops.push({
    ...sop,
    id: key,
    source:"scenario",
    key,
   });
  });
  
  // Add healthcare SOPs
  const healthcareSOPs = getAllHealthcareSOPs();
  if (healthcareSOPs) {
   Object.entries(healthcareSOPs).forEach(([key, sop]) => {
    sops.push({
     ...sop,
     id: sop.id || key,
     source:"healthcare",
     key,
    });
   });
  }
  
  // Add status SOPs
  Object.entries(SOP_INDEX).forEach(([key, sop]) => {
   sops.push({
    ...sop,
    id: key,
    source:"status",
    key,
   });
  });
  
  return sops;
 }, []);

 // Get unique categories
 const categories = useMemo(() => {
  const cats = new Set(["All"]);
  allSOPs.forEach(sop => {
   if (sop.category) cats.add(sop.category);
  });
  return Array.from(cats).sort();
 }, [allSOPs]);

 // Get unique states
 const states = useMemo(() => {
  const stateSet = new Set(["All"]);
  allSOPs.forEach(sop => {
   if (sop.state) {
    if (sop.state ==="All") stateSet.add("All");
    else stateSet.add(sop.state);
   }
  });
  return Array.from(stateSet).sort();
 }, [allSOPs]);

 // Filter SOPs
 const filteredSOPs = useMemo(() => {
  return allSOPs.filter(sop => {
   // Search filter
   const matchesSearch = !searchTerm || 
    sop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sop.steps?.some(step => step.toLowerCase().includes(searchTerm.toLowerCase())) ||
    sop.fullContent?.introduction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sop.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sop.denialCodes?.some(dc => dc.code?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  dc.description?.toLowerCase().includes(searchTerm.toLowerCase()));

   // Category filter
   const matchesCategory = selectedCategory ==="All" || sop.category === selectedCategory;

   // State filter
   const matchesState = selectedState ==="All" || 
    sop.state === selectedState || 
    sop.state ==="All";

   return matchesSearch && matchesCategory && matchesState;
  });
 }, [allSOPs, searchTerm, selectedCategory, selectedState]);

 // Handle SOP click
 const handleSOPClick = (sop) => {
  setSelectedSOP(sop);
  setViewerOpen(true);
 };

 // Close viewer
 const handleCloseViewer = () => {
  setViewerOpen(false);
  setSelectedSOP(null);
 };

 // Clear all filters
 const clearFilters = () => {
  setSearchTerm("");
  setSelectedCategory("All");
  setSelectedState("All");
 };

 const hasActiveFilters = searchTerm || selectedCategory !=="All" || selectedState !=="All";

 return (
  <div className="h-full flex flex-col bg-bg02">
   {/* Header */}
   <div className="bg-white border-b border-stroke01 px-6 py-4">
    <div className="flex items-center justify-between mb-4">
     <div className="flex-1">
      <h1 className="text-lg font-bold text-text01">
       Knowledge Base
      </h1>
      <p className="text-sm text-text02 mt-1">
       Browse and search Standard Operating Procedures for claims processing
      </p>
     </div>
     {onNavigate && (
      <button
       onClick={() => onNavigate("store")}
       className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text02 hover:text-pinkTP:text-pinkTP rounded-lg hover:bg-bg03:bg-text01 transition-colors"
       title="Back to FAB Store"
      >
       <Store className="w-3.5 h-3.5" />
       <span className="hidden sm:inline">Store</span>
      </button>
     )}
    </div>

    {/* Search, Filters, and View Controls in One Line */}
    <div className="flex flex-wrap items-center gap-3">
     {/* Search Bar */}
     <div className="relative flex-1 min-w-[200px]">
      <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text03" />
      <input
       type="text"
       placeholder="Search SOPs..."
       value={searchTerm}
       onChange={(e) => setSearchTerm(e.target.value)}
       className="w-full pl-10 pr-4 py-2.5 border border-stroke01 rounded-lg bg-white text-text01 placeholder-text03 focus:outline-none focus:ring-2 focus:ring-pinkTP focus:border-transparent"
      />
      {searchTerm && (
       <button
        onClick={() => setSearchTerm("")}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text03 hover:text-text02:text-stroke01"
       >
        <X className="w-4 h-4" />
       </button>
      )}
     </div>

     {/* Category Filter */}
     <div className="w-40 sm:w-48">
      <select
       value={selectedCategory}
       onChange={(e) => setSelectedCategory(e.target.value)}
       className="w-full px-3 py-2.5 border border-stroke01 rounded-lg bg-white text-text01 text-sm focus:outline-none focus:ring-2 focus:ring-pinkTP"
      >
       {categories.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
       ))}
      </select>
     </div>

     {/* State Filter */}
     <div className="w-40 sm:w-48">
      <select
       value={selectedState}
       onChange={(e) => setSelectedState(e.target.value)}
       className="w-full px-3 py-2.5 border border-stroke01 rounded-lg bg-white text-text01 text-sm focus:outline-none focus:ring-2 focus:ring-pinkTP"
      >
       {states.map(state => (
        <option key={state} value={state}>{state}</option>
       ))}
      </select>
     </div>

     {/* Clear Filters Button (only show if filters are active) */}
     {hasActiveFilters && (
      <button
       onClick={clearFilters}
       className="px-3 py-2.5 text-sm text-text02 hover:text-text01:text-bg03 hover:bg-bg02:bg-text01 rounded-lg transition-colors whitespace-nowrap"
      >
       Clear
      </button>
     )}

     {/* View Mode Toggle */}
     <button
      onClick={() => setViewMode(viewMode ==="grid" ?"list" :"grid")}
      className="p-2.5 rounded-lg border border-stroke01 hover:bg-bg02:bg-text01 text-text02 transition-colors flex-shrink-0"
      title={viewMode ==="grid" ?"Switch to list view" :"Switch to grid view"}
     >
      {viewMode ==="grid" ? <ListIcon className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
     </button>
    </div>
   </div>

   {/* Results Count */}
   <div className="px-6 py-3 bg-bg03 border-b border-stroke01">
    <p className="text-sm text-text02">
     Showing <span className="font-semibold text-text01">{filteredSOPs.length}</span> of{""}
     <span className="font-semibold text-text01">{allSOPs.length}</span> SOPs
    </p>
   </div>

   {/* SOPs List/Grid */}
   <div className="flex-1 overflow-y-auto p-6">
    {filteredSOPs.length === 0 ? (
     <div className="text-center py-20">
      <BookOpen className="w-16 h-16 text-stroke01 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-text01 mb-2">No SOPs found</h3>
      <p className="text-text02 mb-4">
       {hasActiveFilters 
        ?"Try adjusting your filters or search terms"
        :"No SOPs are available"}
      </p>
      {hasActiveFilters && (
       <button
        onClick={clearFilters}
        className="px-4 py-2 bg-pinkTP text-white rounded-lg hover:bg-pinkTP:bg-textLink transition-colors"
       >
        Clear all filters
       </button>
      )}
     </div>
    ) : viewMode ==="grid" ? (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredSOPs.map((sop, index) => (
       <SOPCard key={sop.id || sop.key || index} sop={sop} onClick={() => handleSOPClick(sop)} />
      ))}
     </div>
    ) : (
     <div className="space-y-3">
      {filteredSOPs.map((sop, index) => (
       <SOPListItem key={sop.id || sop.key || index} sop={sop} onClick={() => handleSOPClick(sop)} />
      ))}
     </div>
    )}
   </div>

   {/* SOP Viewer Modal */}
   <AnimatePresence>
    {viewerOpen && selectedSOP && (
     <SOPViewer
      sopId={selectedSOP.source ==="scenario" ? selectedSOP.key : (selectedSOP.id || selectedSOP.key)}
      scenario={selectedSOP.source ==="scenario" ? selectedSOP.key : null}
      onClose={handleCloseViewer}
     />
    )}
   </AnimatePresence>
  </div>
 );
}

/**
 * SOP Card Component (Grid View)
 */
function SOPCard({ sop, onClick }) {
 return (
  <motion.div
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   whileHover={{ y: -4, transition: { duration: 0.2 } }}
   onClick={onClick}
   className="bg-white rounded-lg border border-stroke01 p-5 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-pinkTP:border-pinkTP"
  >
   <div className="flex items-start justify-between mb-3">
    <div className="flex-1">
     <h3 className="text-lg font-semibold text-text01 mb-1 line-clamp-2">
      {sop.title ||"Untitled SOP"}
     </h3>
     {sop.id && (
      <p className="text-xs text-text03 font-mono mb-2">
       {sop.id}
      </p>
     )}
    </div>
    <FileText className="w-5 h-5 text-pinkTP flex-shrink-0 ml-2" />
   </div>

   {sop.category && (
    <div className="flex items-center gap-2 mb-2">
     <Tag className="w-3 h-3 text-text03" />
     <span className="text-xs text-text02">{sop.category}</span>
    </div>
   )}

   {sop.state && (
    <div className="flex items-center gap-2 mb-3">
     <MapPin className="w-3 h-3 text-text03" />
     <span className="text-xs text-text02">{sop.state}</span>
    </div>
   )}

   {sop.fullContent?.introduction && (
    <p className="text-sm text-text02 line-clamp-3 mb-3">
     {sop.fullContent.introduction}
    </p>
   )}

   {sop.steps && sop.steps.length > 0 && (
    <div className="mb-3">
     <p className="text-xs text-text03 mb-1">
      {sop.steps.length} step{sop.steps.length > 1 ?"s" :""}
     </p>
    </div>
   )}

   {sop.denialCodes && sop.denialCodes.length > 0 && (
    <div className="flex flex-wrap gap-1 mb-3">
     {sop.denialCodes.slice(0, 3).map((dc, idx) => (
      <span
       key={idx}
       className="px-2 py-0.5 text-xs bg-pinkTP/20 text-textLink rounded"
      >
       {dc.code}
      </span>
     ))}
     {sop.denialCodes.length > 3 && (
      <span className="px-2 py-0.5 text-xs text-text03">
       +{sop.denialCodes.length - 3} more
      </span>
     )}
    </div>
   )}

   <div className="flex items-center justify-between pt-3 border-t border-stroke01">
    <span className="text-xs text-text03">Click to view</span>
    <ChevronRight className="w-4 h-4 text-text03" />
   </div>
  </motion.div>
 );
}

/**
 * SOP List Item Component (List View)
 */
function SOPListItem({ sop, onClick }) {
 return (
  <motion.div
   initial={{ opacity: 0, x: -20 }}
   animate={{ opacity: 1, x: 0 }}
   onClick={onClick}
   className="bg-white rounded-lg border border-stroke01 p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-pinkTP:border-pinkTP"
  >
   <div className="flex items-start justify-between">
    <div className="flex-1">
     <div className="flex items-center gap-3 mb-2">
      <h3 className="text-lg font-semibold text-text01">
       {sop.title ||"Untitled SOP"}
      </h3>
      {sop.category && (
       <span className="px-2 py-1 text-xs bg-bg03 text-text02 rounded">
        {sop.category}
       </span>
      )}
      {sop.state && sop.state !=="All" && (
       <span className="px-2 py-1 text-xs bg-neutral01 text-neutral02 rounded flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        {sop.state}
       </span>
      )}
     </div>
     {sop.id && (
      <p className="text-xs text-text03 font-mono mb-2">
       {sop.id}
      </p>
     )}
     {sop.fullContent?.introduction && (
      <p className="text-sm text-text02 line-clamp-2 mb-2">
       {sop.fullContent.introduction}
      </p>
     )}
     <div className="flex items-center gap-4 text-xs text-text03">
      {sop.steps && (
       <span>{sop.steps.length} step{sop.steps.length > 1 ?"s" :""}</span>
      )}
      {sop.denialCodes && sop.denialCodes.length > 0 && (
       <span>{sop.denialCodes.length} denial code{sop.denialCodes.length > 1 ?"s" :""}</span>
      )}
      {sop.page && (
       <span>Page {sop.page.replace("Page","")}</span>
      )}
     </div>
    </div>
    <ChevronRight className="w-5 h-5 text-text03 flex-shrink-0 ml-4" />
   </div>
  </motion.div>
 );
}


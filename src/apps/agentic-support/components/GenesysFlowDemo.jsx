import { useState, useEffect } from 'react';
import { Phone, ArrowRight, CheckCircle2, Clock, AlertCircle, Zap, Brain, BookOpen, Cpu, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConversations, getConversationDetails } from '../services/genesysService';

const FLOW_STEPS = [
 {
  id: 'customer',
  label: 'Customer Contacts',
  description: 'Customer calls/contacts support',
  icon: Phone,
  color: 'blue',
 },
 {
  id: 'genesys',
  label: 'Genesys Receives',
  description: 'Genesys routes to support queue',
  icon: Zap,
  color: 'purple',
 },
 {
  id: 'webhook',
  label: 'FAB Agents Intercept',
  description: 'Webhook triggers FAB Agents',
  icon: ArrowRight,
  color: 'emerald',
 },
 {
  id: 'capture',
  label: 'Voice/Chat Capture',
  description: 'Capture Agent transcribes',
  icon: Phone,
  color: 'indigo',
 },
 {
  id: 'intent',
  label: 'Intent Detection',
  description: 'Intent Agent classifies issue',
  icon: Brain,
  color: 'cyan',
 },
 {
  id: 'knowledge',
  label: 'Knowledge Base',
  description: 'Knowledge Agent finds solution',
  icon: BookOpen,
  color: 'amber',
 },
 {
  id: 'diagnostic',
  label: 'Diagnostic',
  description: 'Diagnostic Agent analyzes',
  icon: Cpu,
  color: 'orange',
 },
 {
  id: 'resolution',
  label: 'Resolution',
  description: 'Issue resolved or escalated',
  icon: CheckCircle2,
  color: 'green',
 },
];

export default function GenesysFlowDemo({ conversationId, onComplete }) {
 const [currentStep, setCurrentStep] = useState(0);
 const [isPlaying, setIsPlaying] = useState(false);
 const [conversation, setConversation] = useState(null);
 const [flowData, setFlowData] = useState({
  customerName: 'Customer',
  issue: 'Printer offline on floor 3',
  resolution: null,
 });

 useEffect(() => {
  if (conversationId) {
   loadConversation();
  }
 }, [conversationId]);

 useEffect(() => {
  if (isPlaying && currentStep < FLOW_STEPS.length - 1) {
   const timer = setTimeout(() => {
    setCurrentStep(prev => prev + 1);
   }, 2000); // 2 seconds per step
   return () => clearTimeout(timer);
  } else if (isPlaying && currentStep === FLOW_STEPS.length - 1) {
   setIsPlaying(false);
   if (onComplete) {
    setTimeout(() => onComplete(), 1000);
   }
  }
 }, [isPlaying, currentStep, onComplete]);

 const loadConversation = async () => {
  try {
   const details = await getConversationDetails(conversationId);
   setConversation(details);
   
   // Extract customer info from conversation
   const participant = details.participants?.[0];
   if (participant) {
    setFlowData(prev => ({
     ...prev,
     customerName: participant.name || participant.address || 'Customer',
    }));
   }
  } catch (error) {
   console.error('Error loading conversation:', error);
  }
 };

 const handleStart = () => {
  setCurrentStep(0);
  setIsPlaying(true);
 };

 const handleReset = () => {
  setCurrentStep(0);
  setIsPlaying(false);
 };

 const getStepColor = (step, index) => {
  if (index < currentStep) {
   return 'bg-success010 text-white border-success03';
  } else if (index === currentStep) {
   return 'bg-neutral010 text-white border-neutral02 animate-pulse';
  } else {
   return 'bg-stroke01 text-text02 border-stroke01';
  }
 };

 return (
  <div className="bg-white border-2 border-stroke01 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6">
   <div className="flex items-center justify-between mb-6">
    <div>
     <h3 className="text-lg font-bold text-text01 mb-1">Enterprise Flow: Genesys → FAB Agents</h3>
     <p className="text-xs text-text02">
      {conversationId ? `Processing Conversation: ${conversationId.substring(0, 12)}...` : 'Typical customer support flow'}
     </p>
    </div>
    <div className="flex items-center gap-2">
     <button
      onClick={isPlaying ? () => setIsPlaying(false) : handleStart}
      className="px-4 py-2 bg-gradient-to-r from-buttonPrimary to-buttonPrimary-hover text-white rounded-lg text-xs font-bold hover:from-buttonPrimary-hover hover:to-buttonPrimary-active transition-all flex items-center gap-2"
     >
      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      {isPlaying ? 'Pause' : 'Start Flow'}
     </button>
     <button
      onClick={handleReset}
      className="px-3 py-2 bg-stroke01 text-text01 rounded-lg text-xs font-bold hover:bg-stroke01:bg-text02 transition-all"
     >
      Reset
     </button>
    </div>
   </div>

   {/* Flow Visualization */}
   <div className="relative">
    {/* Connection Lines */}
    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stroke01 -translate-y-1/2 z-0" />
    <div 
     className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-neutral010 to-success010 -translate-y-1/2 z-10 transition-all duration-1000"
     style={{ width: `${(currentStep / (FLOW_STEPS.length - 1)) * 100}%` }}
    />

    {/* Flow Steps */}
    <div className="relative flex items-center justify-between py-8">
     {FLOW_STEPS.map((step, index) => {
      const Icon = step.icon;
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;
      const colorClass = getStepColor(step, index);

      return (
       <motion.div
        key={step.id}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
         scale: isActive ? 1.1 : isCompleted ? 1 : 0.9,
         opacity: 1 
        }}
        className="flex flex-col items-center gap-2 flex-1 relative z-20"
       >
        <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center border-2 shadow-lg transition-all`}>
         <Icon className="w-6 h-6" />
        </div>
        <div className="text-center">
         <div className={`text-xs font-bold mb-0.5 ${isActive || isCompleted ? 'text-text01' : 'text-text03'}`}>
          {step.label}
         </div>
         <div className="text-[10px] text-text03">
          {step.description}
         </div>
        </div>
        {isActive && (
         <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-4 h-4 bg-neutral010 rounded-full border-2 border-white"
         />
        )}
       </motion.div>
      );
     })}
    </div>
   </div>

   {/* Flow Details */}
   <AnimatePresence>
    {currentStep > 0 && (
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-6 p-4 bg-bg02 rounded-lg border-2 border-stroke01"
     >
      <div className="flex items-start gap-3">
       <div className="w-8 h-8 rounded-full bg-neutral010 text-white flex items-center justify-center flex-shrink-0">
        {currentStep}
       </div>
       <div className="flex-1">
        <div className="text-sm font-bold text-text01 mb-1">
         {FLOW_STEPS[currentStep].label}
        </div>
        <div className="text-xs text-text02 mb-2">
         {FLOW_STEPS[currentStep].description}
        </div>
        
        {/* Step-specific details */}
        {currentStep === 0 && (
         <div className="text-xs bg-white p-2 rounded border border-stroke01">
          <div className="font-semibold text-text01">Customer:</div>
          <div className="text-text02">{flowData.customerName}</div>
         </div>
        )}
        
        {currentStep === 1 && conversation && (
         <div className="text-xs bg-white p-2 rounded border border-stroke01">
          <div className="font-semibold text-text01">Genesys Conversation ID:</div>
          <div className="text-text02 font-mono">{conversation.id}</div>
          <div className="font-semibold text-text01 mt-1">Channel:</div>
          <div className="text-text02">{conversation.mediaType || 'voice'}</div>
         </div>
        )}
        
        {currentStep === 2 && (
         <div className="text-xs bg-white p-2 rounded border border-stroke01">
          <div className="font-semibold text-text01">Webhook Event:</div>
          <div className="text-text02">conversation.created</div>
          <div className="font-semibold text-text01 mt-1">Action:</div>
          <div className="text-text02">FAB Agents triggered</div>
         </div>
        )}
        
        {currentStep === 3 && (
         <div className="text-xs bg-white p-2 rounded border border-stroke01">
          <div className="font-semibold text-text01">Captured Text:</div>
          <div className="text-text02 italic">"{flowData.issue}"</div>
         </div>
        )}
        
        {currentStep === 4 && (
         <div className="text-xs bg-white p-2 rounded border border-stroke01">
          <div className="font-semibold text-text01">Detected Intent:</div>
          <div className="text-text02">Printer Offline</div>
          <div className="font-semibold text-text01 mt-1">Workflow:</div>
          <div className="text-text02">printer_offline</div>
         </div>
        )}
        
        {currentStep === 5 && (
         <div className="text-xs bg-white p-2 rounded border border-stroke01">
          <div className="font-semibold text-text01">Knowledge Matched:</div>
          <div className="text-text02">Network connectivity procedure (Sec 3.2)</div>
          <div className="text-text03 text-[10px] mt-1">Printer_Guide.pdf p.12-15 • 94% match</div>
         </div>
        )}
        
        {currentStep === 6 && (
         <div className="text-xs bg-white p-2 rounded border border-stroke01">
          <div className="font-semibold text-text01">Diagnosis:</div>
          <div className="text-text02">Network connectivity issue detected</div>
          <div className="font-semibold text-text01 mt-1">Confidence:</div>
          <div className="text-text02">92%</div>
         </div>
        )}
        
        {currentStep === 7 && (
         <div className="text-xs bg-white p-2 rounded border border-success01">
          <div className="font-semibold text-success02 flex items-center gap-1">
           <CheckCircle2 className="w-3.5 h-3.5" />
           Resolution Complete
          </div>
          <div className="text-text02 mt-1">Issue resolved automatically</div>
          {conversationId && (
           <div className="text-text03 text-[10px] mt-1">
            Genesys conversation updated with resolution
           </div>
          )}
         </div>
        )}
       </div>
      </div>
     </motion.div>
    )}
   </AnimatePresence>

   {/* Progress Indicator */}
   <div className="mt-4 flex items-center gap-2">
    <div className="flex-1 h-2 bg-stroke01 rounded-full overflow-hidden">
     <motion.div
      className="h-full bg-gradient-to-r from-neutral010 to-success010"
      initial={{ width: 0 }}
      animate={{ width: `${(currentStep / (FLOW_STEPS.length - 1)) * 100}%` }}
      transition={{ duration: 0.3 }}
     />
    </div>
    <span className="text-xs font-bold text-text02">
     {Math.round((currentStep / (FLOW_STEPS.length - 1)) * 100)}%
    </span>
   </div>
  </div>
 );
}

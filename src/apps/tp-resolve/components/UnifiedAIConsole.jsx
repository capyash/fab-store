import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Sparkles, CheckCircle2, Brain, Zap, TrendingUp, AlertCircle, Activity, ArrowDown, FileText, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { aiAPI, casesAPI } from "../services/api";
import { SCENARIO_SOPS, getSOPByScenario } from "../data/sops";
import { ReasoningCard } from "./platformComponents";

const msgVariants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
const isDefined = (x) => x !== undefined && x !== null;
const isEngineMsg = (m) => isDefined(m) && (m.role === "ai-step" || m.role === "ai-reco" || m.role === "ai-model");
const isChatMsg = (m) => isDefined(m) && (m.role === "user" || m.role === "ai");

export default function UnifiedAIConsole({ onBind, onSOPReference, onSOPView, caseId, case: caseData = null }) {
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [reasoningExpanded, setReasoningExpanded] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [followUpSuggestions, setFollowUpSuggestions] = useState([]);
  const bottomRef = useRef(null);
  const recommendationRef = useRef(null);
  const reasoningInitialized = useRef(false);
  const pushMessageRef = useRef(null);
  const activeIntervalsRef = useRef(new Set());
  const activeTimeoutsRef = useRef(new Set());
  const chatInputRef = useRef(null);

  const safeMessages = useMemo(() => (Array.isArray(messages) ? messages.filter(isDefined) : []), [messages]);
  const engineMessages = useMemo(() => safeMessages.filter(isEngineMsg), [safeMessages]);
  const recommendation = useMemo(() => engineMessages.find(m => m.role === "ai-reco"), [engineMessages]);

  const pushMessage = useCallback((m) => {
    if (!m || typeof m !== "object" || !("role" in m)) return;
    setMessages((prev) => [...(Array.isArray(prev) ? prev.filter(isDefined) : []), m]);
    
    if (m.text) {
      const sopMatches = m.text.match(/(?:SOP\s*)?(\d+(?:\.\d+){0,2})/gi);
      if (sopMatches && sopMatches.length > 0) {
        const ids = sopMatches.map((t) => {
          const match = t.match(/(\d+(?:\.\d+){0,2})/);
          return match ? match[1] : t.replace(/sop\s*/gi, "").trim();
        }).filter(Boolean);
        onSOPReference?.(ids);
      }
    }
    
    if (m.sopRefs && Array.isArray(m.sopRefs) && m.sopRefs.length > 0) {
      onSOPReference?.(m.sopRefs);
    }
  }, [onSOPReference]);
  
  useEffect(() => {
    pushMessageRef.current = pushMessage;
  }, [pushMessage]);

  useEffect(() => {
    activeIntervalsRef.current.forEach(id => clearInterval(id));
    activeTimeoutsRef.current.forEach(id => clearTimeout(id));
    activeIntervalsRef.current.clear();
    activeTimeoutsRef.current.clear();
    
    setMessages([]);
    setThinking(false);
    setStreamingMessage(null);
    setCurrentStep(null);
    setFollowUpSuggestions([]);
    reasoningInitialized.current = false;
  }, [caseId]);

  // Initialize AI reasoning when case is loaded
  useEffect(() => {
    if (!reasoningInitialized.current && caseId && caseData) {
      reasoningInitialized.current = true;
      setThinking(true);
      
      const executeAIAnalysis = async () => {
        try {
          let caseObj = caseData;
          if (!caseObj && caseId) {
            caseObj = await casesAPI.getById(caseId);
          }
          
          if (!caseObj) {
            console.error("No case data available for analysis");
            setThinking(false);
            return;
          }

          const isDemoMode = localStorage.getItem('cogniclaim.demoMode') === 'true' || 
            new URLSearchParams(window.location.search).get('demo') === 'true';
          
          const onStep = (step) => {
            if (isDemoMode && step.role !== "ai-model") {
              setCurrentStep(step);
              setStreamingMessage({ ...step, text: "" });
              
              const fullText = step.text || "";
              let charIndex = 0;
              
              const typingInterval = setInterval(() => {
                if (charIndex < fullText.length) {
                  setStreamingMessage((prev) => ({
                    ...prev,
                    text: fullText.substring(0, charIndex + 1),
                  }));
                  charIndex++;
                } else {
                  clearInterval(typingInterval);
                  activeIntervalsRef.current.delete(typingInterval);
                  setStreamingMessage(null);
                  pushMessageRef.current?.(step);
                }
              }, 20);
              
              activeIntervalsRef.current.add(typingInterval);
            } else {
              pushMessageRef.current?.(step);
            }
          };

          const result = await aiAPI.analyzeCase(caseObj, onStep);
          
          if (result && result.reasoningSteps) {
            result.reasoningSteps.forEach(step => {
              pushMessageRef.current?.(step);
            });
          }
          
          setThinking(false);
        } catch (error) {
          console.error("AI analysis error:", error);
          setThinking(false);
        }
      };
      
      executeAIAnalysis();
    }
  }, [caseId, caseData]);

  // Scroll to recommendation when it appears
  useEffect(() => {
    if (recommendation && recommendationRef.current) {
      const timeout = setTimeout(() => {
        recommendationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
      activeTimeoutsRef.current.add(timeout);
      return () => {
        clearTimeout(timeout);
        activeTimeoutsRef.current.delete(timeout);
      };
    }
  }, [recommendation]);

  const handleChatSubmit = async (message) => {
    if (!message.trim()) return;
    
    pushMessage({ role: "user", content: message });
    
    try {
      const response = await aiAPI.sendMessage(message, {
        case: caseData,
        caseId,
        reasoningSteps: engineMessages,
      });
      
      pushMessage({
        role: "ai",
        content: response.text,
        sopRefs: response.sopRefs || [],
        suggestions: response.suggestions || [],
      });
      
      if (response.suggestions) {
        setFollowUpSuggestions(response.suggestions);
      }
    } catch (error) {
      console.error("Chat error:", error);
      pushMessage({
        role: "ai",
        content: "I apologize, but I encountered an error. Please try again.",
      });
    }
  };

  const reasoningSteps = engineMessages.filter(m => m.role === "ai-step");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Reasoning Cards Section */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Reasoning Cards Grid */}
          {reasoningSteps.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[0, 1, 2].map((index) => {
                const step = reasoningSteps[index];
                return (
                  <ReasoningCard
                    key={index}
                    step={step}
                    index={index}
                    onSOPView={onSOPView}
                    case={caseData}
                    isStreaming={thinking && index === reasoningSteps.length - 1}
                    isComplete={!thinking}
                    progress={thinking ? 75 : 100}
                  />
                );
              })}
            </div>
          )}

          {/* Recommendation Card */}
          {recommendation && (
            <motion.div
              ref={recommendationRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#612D91] to-[#A64AC9] rounded-xl p-6 text-white shadow-lg"
            >
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">AI Recommendation</h3>
                  <p className="text-white/90 leading-relaxed">{recommendation.text}</p>
                  {recommendation.reasoning && (
                    <p className="text-white/80 text-sm mt-2">{recommendation.reasoning}</p>
                  )}
                </div>
              </div>
              {recommendation.sopRefs && recommendation.sopRefs.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {recommendation.sopRefs.map((ref, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSOPView?.(ref, caseData?.scenario, caseData?.status, null)}
                      className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      SOP {ref}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Loading State */}
          {thinking && reasoningSteps.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#612D91] mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Analyzing case...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Section */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              ref={chatInputRef}
              type="text"
              placeholder="Ask about this case..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleChatSubmit(e.target.value);
                  e.target.value = "";
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#612D91]"
            />
            <button
              onClick={() => {
                if (chatInputRef.current?.value) {
                  handleChatSubmit(chatInputRef.current.value);
                  chatInputRef.current.value = "";
                }
              }}
              className="px-4 py-2 bg-[#612D91] text-white rounded-lg hover:bg-[#512579] transition-colors"
            >
              Send
            </button>
          </div>
          {followUpSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {followUpSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChatSubmit(suggestion)}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/**
 * TP FAB Agents Console
 * Main console component for agentic support workflows
 * Author: Vinod Kumar V (VKV)
 */

import { useEffect, useMemo, useState, useRef } from "react";
import {
  Mic,
  MessageCircle,
  Sparkles,
  Activity,
  Store,
  Brain,
  Wand2,
  Headphones,
  User,
  Cpu,
  Zap,
  AlertCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  Cloud,
  Loader2,
  Mail,
  Send,
  Phone,
  FileText,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import AgenticSupportDemo from "../../../components/AgenticSupportDemo";
import { searchKnowledgeBase, getCategoryForWorkflow } from "../services/knowledgeBase";
import { createTicket, getAvailableTicketingSystems, getTicketingConfig } from "../services/ticketingService";
import { saveTicket } from "../services/ticketsService";
import KnowledgeDocViewer from "./KnowledgeDocViewer";
import CCASConnectionPanel from "./CCASConnectionPanel";
import WebhookEventLog from "./WebhookEventLog";
import CCASConfigPanel from "./CCASConfigPanel";
import LiveDemoController from "./LiveDemoController";
import GenesysConversationsPanel from "./GenesysConversationsPanel";
import GenesysFlowDemo from "./GenesysFlowDemo";
import { getCurrentProvider } from "../services/ccasService";

const INTENT_CATALOG = [
  {
    id: "printer_offline",
    label: "Printer Offline on Floor 3",
    text: "Hi, my office printer on floor 3 is offline and nothing is printing.",
    workflow: "printer_offline",
    keywords: ["offline", "not printing", "network", "floor", "office", "printer"],
  },
  {
    id: "ink_error",
    label: "Genuine Ink Not Recognized",
    text: "My home printer says the cyan cartridge is not recognized even though it is genuine.",
    workflow: "ink_error",
    keywords: ["cartridge", "ink", "cyan", "not recognized", "genuine", "printer"],
  },
];

function HeadsetIcon() {
  return (
    <span className="inline-flex items-center justify-center rounded-lg bg-primary/40 p-1.5">
      <Headphones className="w-4 h-4 text-alert01" />
    </span>
  );
}

function AvatarCircle({ icon, active, pulse = false }) {
  return (
    <motion.div
      className={`relative w-8 h-8 rounded-full flex items-center justify-center ${
        active ? "bg-text01 text-bg01" : "bg-bg02 text-text01"
      } transition-all duration-300`}
      animate={{ scale: active ? 1.1 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      {icon}
      {active && pulse && (
        <motion.span
          className="absolute inset-0 rounded-full bg-primary opacity-75"
          animate={{ scale: [1, 1.5], opacity: [0.75, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </motion.div>
  );
}

export default function AgenticSupportConsole({ onNavigate }) {
  const [interactionText, setInteractionText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const [channel, setChannel] = useState("voice"); // 'voice' | 'chat' | 'email' | 'telemetry'
  const [selectedWorkflow, setSelectedWorkflow] = useState("printer_offline");
  const [stage, setStage] = useState("idle"); // idle → capture → intent-detecting → intent-ready → knowledge-ready → telemetry → running → completed/escalated
  const [detectedDevice, setDetectedDevice] = useState(null); // null, 'laptop', 'printer', 'computer', 'phone'
  const [autoRunToken, setAutoRunToken] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [ticketConfirmed, setTicketConfirmed] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketCopied, setTicketCopied] = useState(false);
  const [ticketCreating, setTicketCreating] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);
  const [selectedTicketingSystem, setSelectedTicketingSystem] = useState(() => {
    const config = getTicketingConfig();
    return config.system || "servicenow";
  });
  const availableSystems = getAvailableTicketingSystems();
  
  // Document viewer state
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [docViewerPage, setDocViewerPage] = useState(1);
  
  // CCAS Infrastructure state
  const [showCCASInfra, setShowCCASInfra] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedGenesysConversation, setSelectedGenesysConversation] = useState(null);
  const [showGenesysFlow, setShowGenesysFlow] = useState(false);
  const [currentProcessingAgent, setCurrentProcessingAgent] = useState(null);
  const [processingStartTime, setProcessingStartTime] = useState(null);
  const [streamingTranscript, setStreamingTranscript] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Ref for Genesys Conversations Panel to refresh it
  const genesysPanelRef = useRef(null);
  
  // Track if demo/interaction is active
  useEffect(() => {
    if (stage !== 'idle') {
      setIsPlaying(true);
    }
  }, [stage]);

  // Track current processing agent based on stage
  useEffect(() => {
    if (stage === 'capture') {
      setCurrentProcessingAgent(channel === 'voice' ? 'Voice Capture Agent' : channel === 'chat' ? 'Chat Capture Agent' : 'Email Parsing Agent');
      setProcessingStartTime(new Date());
    } else if (stage === 'intent-detecting') {
      setCurrentProcessingAgent('Intent Detection Agent');
      setProcessingStartTime(new Date());
    } else if (stage === 'intent-ready') {
      setCurrentProcessingAgent('Intent Detection Agent');
    } else if (stage === 'knowledge-ready') {
      setCurrentProcessingAgent('Knowledge Base Agent');
      setProcessingStartTime(new Date());
    } else if (stage === 'telemetry') {
      setCurrentProcessingAgent('Diagnostic Agent');
      setProcessingStartTime(new Date());
    } else if (stage === 'running') {
      setCurrentProcessingAgent('Action Execution Agent');
      setProcessingStartTime(new Date());
    } else if (stage === 'completed' || stage === 'escalated') {
      setCurrentProcessingAgent(null);
      setProcessingStartTime(null);
    }
  }, [stage, channel]);

  // Email-specific state
  const [emailFrom, setEmailFrom] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // Chat-specific state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // Detect browser speech support
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setHasSpeechSupport(true);
    }
  }, []);

  // Update interactionText based on active channel
  useEffect(() => {
    if (channel === "email") {
      // Combine email subject and body for processing
      const emailText = `${emailSubject ? `Subject: ${emailSubject}\n\n` : ''}${emailBody}`;
      setInteractionText(emailText);
    } else if (channel === "chat") {
      // Use the last user message from chat
      const userMessages = chatMessages.filter(m => m.sender === "user");
      if (userMessages.length > 0) {
        const lastUserMessage = userMessages[userMessages.length - 1];
        setInteractionText(lastUserMessage.text);
      } else {
        setInteractionText("");
      }
    }
    // For voice, interactionText is set directly by speech recognition
  }, [channel, emailSubject, emailBody, chatMessages]);

  // Detect device type from customer input (enhanced for HP products)
  useEffect(() => {
    if (!interactionText) {
      setDetectedDevice(null);
      return;
    }

    const text = interactionText.toLowerCase();
    
    // Check for device keywords - enhanced for HP products
    if (text.includes('laptop') || text.includes('elitebook') || text.includes('spectre') || text.includes('probook') || text.includes('zbook') || text.includes('envy') || text.includes('notebook') || text.includes('screen') || text.includes('display') || text.includes('battery') || text.includes('keyboard') || text.includes('overheating') || text.includes('flickering')) {
      setDetectedDevice('laptop');
    } else if (text.includes('printer') || text.includes('laserjet') || text.includes('officejet') || text.includes('print') || text.includes('ink') || text.includes('cartridge') || text.includes('toner') || text.includes('paper jam')) {
      setDetectedDevice('printer');
    } else if (text.includes('computer') || text.includes('desktop') || text.includes('pc')) {
      setDetectedDevice('computer');
    } else if (text.includes('phone') || text.includes('mobile')) {
      setDetectedDevice('phone');
    } else if (text.includes('tablet') || text.includes('ipad')) {
      setDetectedDevice('tablet');
    } else {
      // Default to computer if no specific device mentioned
      setDetectedDevice('computer');
    }
  }, [interactionText]);

  // Handle "unknown" workflow - create escalation result and ticket
  useEffect(() => {
    if (selectedWorkflow === "unknown" && stage === "running" && !lastResult) {
      const handleUnknownWorkflow = async () => {
        const ticketId = `INC-${Math.floor(100000 + Math.random() * 900000)}`;
        const reason = "No confident playbook match for this request. Escalated to human agent with full context.";
        
        const unknownResult = {
          workflow_type: "unknown",
          status: "escalated",
          diagnosis: {
            workflow: "Unknown intent (no playbook match)",
            root_cause: "Insufficient signal to safely auto-resolve using existing workflows.",
            confidence: 0.2,
          },
          actions: [],
          verification: null,
          escalation: {
            required: true,
            reason,
            ticket_id: ticketId,
          },
          resolution_reason: reason,
        };
        
        // Auto-create ticket for unknown workflows too
        try {
          const ticketData = {
            workflow: "unknown",
            interactionText: interactionText,
            detectedDevice: detectedDevice,
            diagnosis: unknownResult.diagnosis,
            actions: [],
            status: 'escalated',
            category: 'Unknown Category',
            escalationReason: reason,
            ticketId: ticketId,
          };
          
          const ticketResult = await createTicket(ticketData, selectedTicketingSystem);
          setTicketResult(ticketResult);
          setTicketConfirmed(true);
          setShowTicketModal(true);
          
          // Save ticket to storage for Watchtower
          const ticketToSave = {
            id: ticketResult.ticketId || `TKT-${Date.now()}`,
            ticketId: ticketResult.ticketId,
            ticketUrl: ticketResult.url,
            ticketSystem: ticketResult.system,
            workflow: "unknown",
            category: "Unknown Category",
            interactionText: interactionText,
            detectedDevice: detectedDevice,
            status: "escalated",
            diagnosis: null,
            actions: [],
            escalationReason: "No confident playbook match",
            knowledgeBase: null,
            createdAt: ticketResult.createdAt || new Date().toISOString(),
            timestamp: new Date().toISOString(),
          };
          saveTicket(ticketToSave);
          
          // Update unknown result with ticket info
          unknownResult.escalation = {
            ...unknownResult.escalation,
            ticket_id: ticketResult.ticketId,
            ticket_url: ticketResult.url,
            ticket_system: ticketResult.system,
          };
          unknownResult.ticket = {
            ticket_id: ticketResult.ticketId,
            ticket_url: ticketResult.url,
            ticket_system: ticketResult.system,
            created_at: ticketResult.createdAt,
          };
        } catch (error) {
          console.error("Failed to auto-create ticket for unknown workflow:", error);
        }
        
        setLastResult(unknownResult);
        setStage("escalated");
      };
      
      // Add slight delay to simulate processing
      const timer = setTimeout(handleUnknownWorkflow, 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedWorkflow, stage, lastResult, interactionText, detectedDevice, selectedTicketingSystem]);

  // Simple intent scoring (keyword hits)
  const intentScores = useMemo(() => {
    const text = (interactionText || "").toLowerCase();
    const trimmed = text.trim();
    if (!trimmed) return [];

    // Require a minimum of three words before we try to infer intent
    const wordCount = trimmed.split(/\s+/).length;
    if (wordCount < 3) return [];

    return INTENT_CATALOG.map((intent) => {
      const keywordScore =
        intent.keywords?.reduce((score, kw) => {
          if (text.includes(kw.toLowerCase())) return score + 1;
          return score;
        }, 0) || 0;
      return { intent, score: keywordScore };
    })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);
  }, [interactionText]);

  const LOW_CONFIDENCE_THRESHOLD = 0.8;

  // Derive chosen workflow from top scoring intent; if too low, mark as unknown/escalation-only
  useEffect(() => {
    if (!intentScores.length) {
      setSelectedWorkflow("unknown");
      return;
    }
    const [top] = intentScores;
    if (!top || top.score < LOW_CONFIDENCE_THRESHOLD) {
      setSelectedWorkflow("unknown");
      return;
    }
    const preferred = top;
    if (preferred?.intent?.workflow) {
      setSelectedWorkflow(preferred.intent.workflow);
    }
  }, [intentScores]);

  const handleSampleClick = (intent) => {
    setInteractionText(intent.text);
    setLastResult(null);
  };

  const handleStartVoice = () => {
    if (!hasSpeechSupport || isListening || channel !== "voice") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true; // Enable incremental results
    recognition.continuous = true; // Keep listening

    recognition.onresult = (event) => {
      // Process both final and interim results for incremental processing
      let finalText = '';
      let interimText = '';
      
      Array.from(event.results).forEach((result, index) => {
        const transcript = result[0].transcript;
        if (result.isFinal) {
          finalText += transcript + ' ';
        } else {
          interimText += transcript;
        }
      });
      
      // Combine final and interim for real-time display
      const combinedText = finalText + interimText;
      setInteractionText(combinedText);
      
      // Mark as streaming if we have interim results
      if (interimText) {
        setIsStreaming(true);
        setStreamingTranscript(combinedText);
      } else {
        setIsStreaming(false);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsStreaming(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      setIsStreaming(false);
      // Process final transcript if we have enough words
      if (interactionText.trim().split(/\s+/).length >= 4) {
        setLastResult(null);
      }
    };

    try {
      recognition.start();
      setIsListening(true);
      setIsStreaming(true);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      setIsStreaming(false);
    }
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");
    
    // Simulate agent acknowledgment
    setTimeout(() => {
      const agentMessage = {
        id: Date.now() + 1,
        sender: "agent",
        text: "I understand your issue. Let me analyze this and find the best solution...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  const handleLoadEmailSample = () => {
    setEmailFrom("john.smith@company.com");
    setEmailSubject("Printer on Floor 3 Not Working");
    setEmailBody("Hi Support,\n\nOur office printer on floor 3 has been offline since this morning. Nothing is printing and we have several urgent documents that need to be printed for a client meeting.\n\nCan you please help us resolve this ASAP?\n\nThanks,\nJohn Smith\nMarketing Department");
  };

  // Orchestrate the step-by-step flow with intelligent pause detection
  // For voice conversations, support incremental processing as transcript streams in
  useEffect(() => {
    const trimmed = (interactionText || "").trim();
    const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

    // For voice channel with streaming, process incrementally
    if (channel === 'voice' && isStreaming && wordCount >= 3) {
      // Start processing with partial transcript
      setStreamingTranscript(trimmed);
      if (stage === 'idle' || stage === 'capture') {
        setStage("capture");
      }
      // Don't proceed to intent detection until streaming stops
      return;
    }

    // Require at least 4 words before processing (reasonable minimum)
    if (!trimmed || wordCount < 4) {
      setStage("idle");
      setLastResult(null);
      setIsStreaming(false);
      return;
    }

    // If we were streaming and now have enough text, stop streaming and process
    if (isStreaming && wordCount >= 4) {
      setIsStreaming(false);
    }

    // Show capture immediately
    setStage("capture");
    setLastResult(null);

    let debounceTimer, t1, t2, t3, t4;

    // Debounce: Wait for user to pause (stop typing/speaking)
    // This gives them time to complete their thought
    // For voice, use shorter debounce to process faster
    const debounceDelay = channel === 'voice' ? 500 : 1000;
    
    debounceTimer = setTimeout(() => {
      // After pause, show customer input capture
    t1 = setTimeout(() => {
      setStage("intent-detecting");
      }, channel === 'voice' ? 1500 : 2500); // Faster for voice

    t2 = setTimeout(() => {
      setStage("intent-ready");
      }, channel === 'voice' ? 3500 : 5000); // Faster for voice

    t3 = setTimeout(() => {
        setStage("knowledge-ready");
      }, channel === 'voice' ? 5000 : 7000); // Faster for voice

    t4 = setTimeout(() => {
        setStage("telemetry");
      }, channel === 'voice' ? 7000 : 9500); // Faster for voice

      const t5 = setTimeout(() => {
        // Continue workflow for all cases - don't pause on unknown
        setStage("running");
        setAutoRunToken(String(Date.now()));
      }, channel === 'voice' ? 9000 : 12000); // Faster for voice
    }, debounceDelay); // Wait after user stops typing/speaking

    return () => {
      clearTimeout(debounceTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [interactionText, selectedWorkflow, channel, isStreaming]);

  const currentOutcome = useMemo(() => {
    if (!lastResult) return null;

    if (lastResult.escalation?.required) {
      const ticketId = lastResult.escalation.ticket_id || "INC-23017";
      const reason = lastResult.escalation.reason || "Complex diagnostic required human intervention.";
      const systemName = lastResult.escalation.ticket_system || selectedTicketingSystem || "servicenow";
      const systemDisplayName = availableSystems.find(s => s.id === systemName)?.name || "Ticketing System";
      const ticketUrl = lastResult.escalation.ticket_url;
      
      return {
        status: "Escalated",
        summary: `Ticket ${ticketId} created in ${systemDisplayName}. Reason: ${reason}`,
        kpiLabel: "Ticket Created",
        kpi: ticketId,
        ticketUrl,
        systemName: systemDisplayName,
      };
    }

  return {
    status: "Self-healed",
    summary: lastResult.resolution_reason || "Issue handled by agentic workflow.",
    kpiLabel: "Time Saved",
    kpi: "~15 min",
  };
}, [lastResult, selectedTicketingSystem, availableSystems]);

  const intentStatus = useMemo(() => {
    switch (stage) {
      case "idle":
        return "Waiting for input";
      case "capture":
        return channel === "voice" ? "Listening to the issue…" :
               channel === "chat" ? "Reading chat conversation…" :
               channel === "email" ? "Parsing email content…" :
               "Capturing input…";
      case "intent-detecting":
        return "Evaluating possible intents…";
      case "intent-ready":
        return "Best workflow selected";
      case "telemetry":
        return "Validating against telemetry…";
      case "running":
        return "Driving self-heal steps…";
      case "completed":
        return "Run completed";
      case "escalated":
        return "Escalated to human";
      default:
        return "Processing…";
    }
  }, [stage, channel]);

  const telemetryStatus = useMemo(() => {
    switch (stage) {
      case "telemetry":
        return "Snapshotting printer & account state…";
      case "running":
        return "Monitoring device while actions run…";
      case "completed":
        return "Final state captured";
      case "escalated":
        return "Snapshot attached to ticket";
      default:
        return "Ready to read device signals";
    }
  }, [stage]);

  const timeline = useMemo(() => {
    if (!lastResult) return [];
    const steps = [];
    if (interactionText) {
      const channelInfo = {
        voice: {
          label: "Voice Capture Agent",
          icon: <Mic className="w-3.5 h-3.5" />,
          color: "text-neutral02",
          bg: "bg-neutral01",
        },
        chat: {
          label: "Chat Capture Agent",
          icon: <MessageCircle className="w-3.5 h-3.5" />,
          color: "text-success02",
          bg: "bg-success01",
        },
        email: {
          label: "Email Parsing Agent",
          icon: <Mail className="w-3.5 h-3.5" />,
          color: "text-primary",
          bg: "bg-bg02 ",
        },
      };
      
      const channelData = channelInfo[channel] || channelInfo.voice;
      
      steps.push({
        key: "capture",
        label: channelData.label,
        icon: channelData.icon,
        color: channelData.color,
        bg: channelData.bg,
        body: channel === "email" && emailSubject 
          ? `From: ${emailFrom || "customer@company.com"}\nSubject: ${emailSubject}\n\n${emailBody.substring(0, 150)}${emailBody.length > 150 ? '...' : ''}`
          : `"${interactionText.substring(0, 200)}${interactionText.length > 200 ? '...' : ''}"`,
      });
    }
    steps.push({
      key: "intent",
      label: "Intent Detection Agent",
      icon: <Brain className="w-3.5 h-3.5" />,
      color: "text-primary",
      bg: "bg-neutral01",
      body:
        lastResult.diagnosis?.workflow || lastResult.workflow_type
          ? `Matched workflow: ${lastResult.diagnosis?.workflow || lastResult.workflow_type}`
          : "Workflow selected based on device + error pattern.",
    });
    
    // Knowledge Base search step (enhanced reasoning)
    if (selectedWorkflow && selectedWorkflow !== "unknown") {
      const kbResults = searchKnowledgeBase(interactionText, null);
      if (kbResults.length > 0) {
        steps.push({
          key: "kb-search",
          label: "Knowledge Base Agent",
          icon: <BookOpen className="w-3.5 h-3.5" />,
          color: "text-primary",
          bg: "bg-bg02 ",
          body: `Retrieved ${kbResults.length} relevant knowledge chunks from vectorized database. Context: ${kbResults[0]?.text?.substring(0, 100)}...`,
        });
      }
    }
    
    if (lastResult.diagnosis?.root_cause) {
      steps.push({
        key: "diagnosis",
        label: "Diagnostic Agent",
        icon: <Activity className="w-3.5 h-3.5" />,
        color: "text-alert02",
        bg: "bg-alert01",
        body: `${lastResult.diagnosis.root_cause} ${lastResult.diagnosis.confidence ? `(Confidence: ${(lastResult.diagnosis.confidence * 100).toFixed(0)}%)` : ""}`,
      });
    }
    if (lastResult.actions?.length) {
      const actionNames = lastResult.actions.map((a) => a.name).join(" · ");
      steps.push({
        key: "actions",
        label: "Action Execution Agent",
        icon: <Wand2 className="w-3.5 h-3.5" />,
        color: "text-alert02",
        bg: "bg-alert01",
        body: actionNames,
      });
    }
    if (lastResult.verification) {
      steps.push({
        key: "verify",
        label: "Verification Agent",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        color: "text-success02",
        bg: "bg-success01",
        body:
          lastResult.verification.details ||
          "Key checks passed so we trust the self-heal before closing.",
      });
    }
    steps.push({
      key: "outcome",
      label: lastResult.escalation?.required ? "Escalation Decision Agent" : "Closure Decision Agent",
      icon: lastResult.escalation?.required ? (
        <AlertCircle className="w-3.5 h-3.5" />
      ) : (
        <Zap className="w-3.5 h-3.5" />
      ),
      color: lastResult.escalation?.required ? "text-error02" : "text-pinkTP",
      bg: lastResult.escalation?.required ? "bg-pinkTP/10" : "bg-pinkTP/10",
      body:
        lastResult.resolution_reason ||
        (lastResult.escalation?.required
          ? "Escalated because the agent hit a policy or diagnostic boundary."
          : "Issue handled end-to-end by the agentic workflow."),
    });
    
    // Ticketing system integration step (when ticket is created)
    if (lastResult.escalation?.required && ticketConfirmed) {
      const systemName = lastResult.escalation.ticket_system || selectedTicketingSystem || "servicenow";
      const systemDisplayName = availableSystems.find(s => s.id === systemName)?.name || "Ticketing System";
      const ticketId = lastResult.escalation.ticket_id || "N/A";
      const ticketUrl = lastResult.escalation.ticket_url;
      
      steps.push({
        key: systemName,
        label: `${systemDisplayName} Integration Agent`,
        icon: <Cloud className="w-3.5 h-3.5" />,
        color: "text-neutral02",
        bg: "bg-neutral01",
        body: `Ticket ${ticketId} created in ${systemDisplayName}.${ticketUrl ? ` View ticket: ${ticketUrl}` : ""} Payload includes: customer interaction, telemetry snapshot, diagnostic results, and escalation reason. API response: 201 Created.`,
      });
    }
    
    return steps;
  }, [lastResult, interactionText, selectedWorkflow, ticketConfirmed, selectedTicketingSystem, availableSystems, channel, emailFrom, emailSubject, emailBody]);

  // Keep workflow state in sync: reset when new interaction starts
  useEffect(() => {
    if (stage === "capture") {
      setLastResult(null);
      setTicketConfirmed(false);
      setShowTicketModal(false);
      setTicketCopied(false);
    }
  }, [stage]);

  // Handle interactions from Live Interaction Monitor
  const handleDemoInteraction = (interaction) => {
    // Update channel
    if (interaction.channel === 'voice') {
      setChannel('voice');
    } else if (interaction.channel === 'sms' || interaction.channel === 'whatsapp' || interaction.channel === 'chat') {
      setChannel('chat');
    }
    
    // Update interaction text
    setInteractionText(interaction.text);
    
    // Detect device type from interaction text or use provided device type
    const text = (interaction.text || '').toLowerCase();
    let deviceType = interaction.device || null;
    
    if (!deviceType) {
      // Auto-detect from text
      if (text.includes('laptop') || text.includes('elitebook') || text.includes('spectre') || text.includes('probook') || text.includes('zbook') || text.includes('envy') || text.includes('screen') || text.includes('display') || text.includes('battery') || text.includes('keyboard') || text.includes('overheating') || text.includes('flickering')) {
        deviceType = 'laptop';
      } else if (text.includes('printer') || text.includes('laserjet') || text.includes('officejet') || text.includes('ink') || text.includes('cartridge') || text.includes('toner') || text.includes('paper jam')) {
        deviceType = 'printer';
      }
    }
    
    setDetectedDevice(deviceType);
    
    // Update chat messages if not voice
    if (interaction.channel !== 'voice') {
      setChatMessages([
        {
          id: Date.now(),
          sender: 'user',
          text: interaction.text,
          timestamp: new Date().toISOString(),
          from: interaction.from,
          customerName: interaction.customerName
        }
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg02">
      {/* Enhanced Top Bar - Prominent Header */}
      <div className="relative flex items-center justify-between px-6 lg:px-8 py-4 bg-gradient-to-r from-bg01 via-bg02/50 to-bg01 border-b-2 border-stroke01 shadow-shadow-drop">
        {/* Subtle background pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(45deg,transparent_25%,rgba(46,46,46,0.1)_25%,rgba(46,46,46,0.1)_50%,transparent_50%,transparent_75%,rgba(46,46,46,0.1)_75%,rgba(46,46,46,0.1))] bg-[length:20px_20px]" />
        
        <div className="relative flex items-center gap-5 flex-1 min-w-0">
          {/* Icon with enhanced styling */}
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-text01 to-buttonPrimary-hover flex items-center justify-center shadow-lg border-2 border-stroke01">
            <Headphones className="w-6 h-6 text-bg01" />
          </div>
          
          {/* Title Section - More Prominent */}
          <div className="flex-shrink-0 min-w-0">
            <h2 className="text-lg font-bold text-text01  tracking-tight mb-0.5">AI Console</h2>
            <p className="text-xs font-semibold text-text02 uppercase tracking-wider">Multi-Channel Intelligence Stream</p>
          </div>
          
          {/* Divider */}
          <span className="hidden sm:block h-8 w-px bg-gradient-to-b from-transparent via-stroke01 to-transparent" />
          
          {/* Navigation Buttons - Enhanced */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowCCASInfra(!showCCASInfra)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                showCCASInfra
                  ? 'bg-gradient-to-r from-text01 to-buttonPrimary-hover text-bg01 shadow-md hover:from-buttonPrimary-hover hover:to-buttonPrimary-active border-2 border-text01'
                  : 'bg-bg01 text-text01  hover:bg-bg02  border-2 border-stroke01'
              }`}
            >
              <Zap className="w-4 h-4" />
              CCAS
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate("store")}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-text01  hover:bg-bg02  rounded-lg transition-all bg-bg01 border-2 border-stroke01 shadow-sm hover:shadow-md hover:border-stroke01 "
              >
                <Store className="w-4 h-4" />
                Store
              </button>
            )}
          </div>
        </div>
        
        {/* Live Status Badge - Enhanced */}
        <div className="relative flex items-center gap-3 flex-shrink-0">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-success01 to-success01/50 border-2 border-success03 text-success02 text-xs font-bold shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success010 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success010" />
            </span>
            LIVE
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6 p-6 overflow-y-auto min-h-0">
      {/* CCAS Infrastructure Section - Compact, Space-Optimized */}
      {showCCASInfra && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg01 rounded-xl p-3 border-2 border-stroke01 shadow-shadow-drop"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-text01 to-buttonPrimary-hover flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-bg01" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text01 ">CCAS Integration</h3>
                <p className="text-[10px] text-text03">Enterprise Contact Center Infrastructure</p>
              </div>
            </div>
            <button
              onClick={() => setShowCCASInfra(false)}
              className="text-[10px] text-text03 hover:text-text02 px-2 py-1 rounded hover:bg-bg02  transition-colors font-medium"
            >
              Collapse
            </button>
          </div>
          
          {/* Compact 3-column layout for better space usage */}
          <div className="grid gap-3 grid-cols-1 lg:grid-cols-3">
            {/* Column 1: Live Interaction Monitor - Compact */}
            <div className="h-[240px] lg:col-span-1">
              <LiveDemoController 
                onInteractionCapture={handleDemoInteraction}
                onCreateGenesysConversation={async (conversation) => {
                  if (genesysPanelRef.current) {
                    await genesysPanelRef.current.refresh();
                    const autoProcess = localStorage.getItem('agenticSupport.autoProcessGenesys') === 'true';
                    if (autoProcess && genesysPanelRef.current.selectConversation) {
                      setTimeout(() => {
                        genesysPanelRef.current.selectConversation(conversation);
                      }, 1000);
                    }
                  }
                }}
              />
            </div>
            
            {/* Column 2: CCAS Connection Status - Compact */}
            <div className="h-[240px] lg:col-span-1">
              <CCASConnectionPanel provider={getCurrentProvider()} />
            </div>

            {/* Column 3: Genesys Conversations Panel - Compact, only if Genesys */}
            {getCurrentProvider() === 'genesys' && (
              <div className="h-[240px] lg:col-span-1">
                <GenesysConversationsPanel 
                  ref={genesysPanelRef}
                  onSelectConversation={(conversation) => {
                    setSelectedGenesysConversation(conversation);
                    if (conversation.participants?.[0]) {
                      const participant = conversation.participants[0];
                      const transcript = conversation._demoTranscript || 
                                       (conversation.messages?.[0]?.textBody) ||
                                       `Customer inquiry from Genesys conversation ${conversation.id}`;
                      const workflow = conversation._demoWorkflow || 'printer_offline';
                      const device = conversation._demoDevice || null;
                      
                      handleDemoInteraction({
                        channel: conversation.mediaType === 'call' ? 'voice' : 'chat',
                        text: transcript,
                        from: participant.address || participant.name,
                        customerName: participant.name || 'Genesys Customer',
                        workflow: workflow,
                        device: device,
                        genesysConversationId: conversation.id,
                      });
                    }
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Show toggle button when CCAS section is hidden */}
      {!showCCASInfra && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowCCASInfra(true)}
          className="w-full py-3 px-4 text-sm font-medium text-text02 hover:text-text01 bg-bg02 hover:bg-bg02    rounded-lg border-2 border-stroke01 transition-all hover:border-stroke01 hover:shadow-sm"
        >
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            Show CCAS Integration
          </div>
        </motion.button>
      )}


      {/* TP Console Core - Our Product/IP */}
      <div className="relative bg-bg01 rounded-xl p-6 border-2 border-stroke01 shadow-shadow-drop">
        {/* Clean Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-stroke01">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-bg01" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text01 ">TP Console Core</h3>
              <p className="text-xs text-text01  font-medium">Real-time AI Support Intelligence</p>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-gradient-to-r from-text01 to-buttonPrimary-hover text-bg01 text-xs font-bold rounded-lg shadow-sm">
            PROPRIETARY
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Customer – subtle indigo */}
          <motion.div
            animate={{
              boxShadow:
                stage === "capture"
                  ? "0 12px 30px rgba(128,149,228,0.35)"
                  : "0 2px 8px rgba(15,23,42,0.08)",
            }}
            transition={{ duration: 0.3 }}
            className={`relative rounded-xl border-2 px-5 py-5 flex flex-col gap-4 transition-all duration-300 h-[320px] ${
              stage === "capture"
                ? "border-text01 bg-bg01 shadow-lg"
                : "border-stroke01 bg-bg01 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AvatarCircle active={stage !== "idle"} pulse={stage === "capture"} icon={<User className="w-4 h-4" />} />
                <p className="text-base font-bold text-text01 ">Customer Input</p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-bg01 bg-buttonPrimary rounded-lg shadow-sm">
                {channel === "voice" && <><Phone className="w-3.5 h-3.5" /> Voice</>}
                {channel === "chat" && <><MessageCircle className="w-3.5 h-3.5" /> Chat</>}
                {channel === "email" && <><Mail className="w-3.5 h-3.5" /> Email</>}
            </div>
            </div>

            {/* Display captured text with metadata */}
            {interactionText ? (
              <div className="space-y-2">
                {/* Metadata bar */}
                <div className="flex items-center justify-between text-xs text-text03">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Customer #{Math.floor(Math.random() * 9000) + 1000}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-success01 text-success02 rounded-full font-semibold">
                    Captured
                  </span>
                </div>

                {/* Main text */}
                <div className="bg-gradient-to-br from-bg01 to-neutral01/30 rounded-lg border border-neutral01 p-3">
                  <p className="text-base text-text01 leading-relaxed">
                    {interactionText}
                    {isStreaming && channel === 'voice' && (
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-neutral02 ml-1"
                      />
                    )}
                  </p>
                  {isStreaming && channel === 'voice' && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-neutral02">
                      <Activity className="w-3 h-3 animate-pulse" />
                      <span className="font-semibold">Streaming transcript...</span>
                    </div>
                  )}
                </div>

                {/* Analysis metadata */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-text01 ">
                    <span className="font-semibold">Words:</span>
                    <span>{interactionText.trim().split(/\s+/).length}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text01 ">
                    <span className="font-semibold">Lang:</span>
                    <span>EN</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text01 ">
                    <span className="font-semibold">Sentiment:</span>
                    {/* Production: Use OpenAI GPT-4 with sentiment classification or specialized models like:
                        - DistilBERT fine-tuned on emotion/sentiment datasets
                        - Azure Text Analytics Sentiment API
                        - Google Cloud Natural Language API
                        Sentiment analysis based on issue keywords */}
                    <span className={`font-semibold ${
                      interactionText.toLowerCase().includes('not working') || 
                      interactionText.toLowerCase().includes('error') ||
                      interactionText.toLowerCase().includes('problem') ? 'text-error02' :
                      interactionText.toLowerCase().includes('slow') ||
                      interactionText.toLowerCase().includes('issue') ? 'text-alert02' :
                      'text-success02'
                    }`}>
                      {interactionText.toLowerCase().includes('not working') || 
                       interactionText.toLowerCase().includes('error') ||
                       interactionText.toLowerCase().includes('problem') ? 'Urgent' :
                       interactionText.toLowerCase().includes('slow') ||
                       interactionText.toLowerCase().includes('issue') ? 'Concerned' :
                       'Neutral'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-bg02  flex items-center justify-center">
                    <User className="w-6 h-6 text-text03" />
                  </div>
                  <p className="text-xs text-text01  font-medium">
                    Waiting for input...
                  </p>
                  <p className="text-[10px] text-text03 mt-0.5">
                    Use Live Monitor above
              </p>
            </div>
              </div>
            )}

            {/* All input now comes from Live Interaction Monitor - no local UI needed */}
            <div className="hidden">
              {/* Keeping structure for state management only */}
              {channel === "email" && (
                <div className="space-y-2">
                  <div className="bg-bg01 rounded-lg border border-stroke01 p-2">
                <input
                      type="email"
                      placeholder="From: customer@company.com"
                      value={emailFrom}
                      onChange={(e) => setEmailFrom(e.target.value)}
                      className="w-full text-xs px-2 py-1 border-2 border-stroke01 rounded focus:ring-2 focus:ring-text01/20 focus:border-text01 outline-none"
                    />
                  </div>
                  <div className="bg-bg01 rounded-lg border border-stroke01 p-2">
                <input
                      type="text"
                      placeholder="Subject: Describe your issue"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full text-xs px-2 py-1 border-2 border-stroke01 rounded focus:ring-2 focus:ring-text01/20 focus:border-text01 outline-none"
                    />
                  </div>
                  <div className="bg-bg01 rounded-lg border border-stroke01 p-2">
                    <textarea
                      placeholder="Email body: Explain the problem in detail..."
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      rows={4}
                      className="w-full text-xs px-2 py-1 border-2 border-stroke01 rounded focus:ring-2 focus:ring-text01/20 focus:border-text01 outline-none resize-none"
                    />
            </div>
                </div>
              )}

              {/* Chat Input */}
              {channel === "chat" && (
                <div className="space-y-2">
                  <div className="bg-bg01 rounded-lg border border-stroke01 p-2 max-h-40 overflow-y-auto">
                    {chatMessages.length === 0 ? (
                      <p className="text-xs text-text03 italic py-2 text-center">Start a conversation...</p>
                    ) : (
                      <div className="space-y-2">
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg px-3 py-1.5 ${
                                msg.sender === "user"
                                  ? "bg-gradient-to-r from-text01 to-buttonPrimary-hover text-bg01"
                                  : "bg-bg02 text-text01"
                              }`}
                            >
                              <p className="text-xs">{msg.text}</p>
                              <span className="text-[10px] opacity-70 mt-0.5 block">{msg.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                      className="flex-1 text-xs px-3 py-2 border border-stroke01 rounded-lg focus:ring-2 focus:ring-success01 focus:border-success03 outline-none"
                    />
                <button
                      onClick={handleSendChatMessage}
                      disabled={!chatInput.trim()}
                      className="px-3 py-2 bg-gradient-to-r from-text01 to-buttonPrimary-hover text-bg01 rounded-lg hover:from-buttonPrimary-hover hover:to-buttonPrimary-active disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                      <Send className="w-3.5 h-3.5" />
                </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Column 2: Intent Brain – subtle teal */}
          <motion.div
            animate={{
              boxShadow: ["intent-detecting", "intent-ready"].includes(stage)
                ? "0 12px 30px rgba(27,192,186,0.35)"
                : "0 2px 8px rgba(15,23,42,0.08)",
            }}
            transition={{ duration: 0.3 }}
            className={`relative rounded-xl px-5 py-5 flex flex-col gap-4 transition-all duration-300 border-2 h-[320px] overflow-y-auto ${
              ["intent-detecting", "intent-ready"].includes(stage)
                ? "border-text01 bg-bg01 shadow-lg"
                : "border-stroke01 bg-bg01 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AvatarCircle
                  active={["intent-detecting", "intent-ready", "telemetry", "running", "completed", "escalated"].includes(stage)}
                  pulse={["intent-detecting"].includes(stage)}
                  icon={<Brain className="w-4 h-4" />}
                />
                <p className="text-lg font-bold text-text01 ">Intent Brain</p>
              </div>
              <p className="text-[11px] text-text03">{intentStatus}</p>
            </div>
            {(!interactionText || interactionText.trim().split(/\s+/).length < 3) ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-neutral01 to-neutral01 flex items-center justify-center border-2 border-neutral01">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-xs text-text01  font-medium">
                    Waiting for customer issue
                  </p>
                  <p className="text-[10px] text-text03 mt-0.5">
                    Intent Brain will analyze and route to workflow
                  </p>
                </div>
              </div>
            ) : selectedWorkflow === "unknown" ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center py-6 px-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-alert01 to-alert01 flex items-center justify-center border-2 border-alert01">
                    <AlertCircle className="w-6 h-6 text-alert02" />
                  </div>
                  <p className="text-xs text-text02 font-medium mb-1">
                    No matching workflow found
                </p>
                  <p className="text-[10px] text-text03">
                    Escalating to human agent with full context
                </p>
                </div>
              </div>
            ) : (
              <div className="mt-1 space-y-2.5 text-sm">
                {/* Primary Match Callout */}
                {intentScores.length > 0 && intentScores[0] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-bg01 border-2 border-stroke01 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-text01 to-buttonPrimary-hover flex items-center justify-center shadow-sm border border-stroke01">
                        <CheckCircle2 className="w-4 h-4 text-bg01" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-text01  text-sm">Matched Category</span>
                          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-text01 to-buttonPrimary-hover text-bg01 text-[10px] font-bold uppercase tracking-wide">
                            Primary
                          </span>
                        </div>
                        <p className="font-semibold text-text01  text-base mb-1">
                          {intentScores[0].intent.label}
                        </p>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-text02">Workflow:</span>
                          <span className="font-mono font-semibold text-text01  bg-bg01 px-2 py-0.5 rounded border-2 border-stroke01">
                            {intentScores[0].intent.workflow}
                          </span>
                          <span className="ml-auto font-bold text-text01 ">
                            {(intentScores[0].score * 25).toFixed(0)}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Knowledge Source - Ultra compact to avoid height jump */}
                {["knowledge-ready", "telemetry", "running", "completed", "escalated"].includes(stage) && 
                 selectedWorkflow !== "unknown" && 
                 intentScores.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="bg-bg02 /50 rounded-lg border border-stroke01 px-3 py-2.5 shadow-sm"
                  >
                    <div className="flex items-start gap-2 justify-between">
                      <div className="flex items-start gap-2 min-w-0 flex-1">
                        <div className="w-5 h-5 rounded-md bg-bg02  flex items-center justify-center border-2 border-stroke01 flex-shrink-0 mt-0.5">
                          <BookOpen className="w-3 h-3 text-text01 " />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-bold text-text01 ">Knowledge Source</span>
                            <span className="px-1 py-0.5 rounded bg-success01 text-success02 text-[8px] font-bold uppercase">Verified</span>
                          </div>
                          <p className="text-[10px] text-text02  leading-snug line-clamp-2">
                            {selectedWorkflow === 'printer_offline' 
                              ? 'Matched "printer", "floor 3", "offline" → Network connectivity procedure (Sec 3.2) • Printer_Guide.pdf p.12-15 • 94%'
                              : 'Matched "ink cartridge", "not recognized" → INK_AUTH_001 troubleshooting (Sec 2.1) • Ink_Error_Resolution.pdf p.8-10 • 94%'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          const startPage = selectedWorkflow === 'printer_offline' ? 12 : 8;
                          setDocViewerPage(startPage);
                          setShowDocViewer(true);
                        }}
                        className="flex-shrink-0 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-text01 to-buttonPrimary-hover text-bg01 rounded hover:from-buttonPrimary-hover hover:to-buttonPrimary-active transition-all text-[10px] font-semibold whitespace-nowrap shadow-sm"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        View
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Alternative Matches - Always show when available */}
                {intentScores.length > 1 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-text03 uppercase tracking-wide">
                      Alternative Matches
                    </p>
                    {intentScores.slice(1, 3).map(({ intent, score }, idx) => (
                    <motion.div
                      key={intent.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (idx + 1) * 0.1 + 0.3 }}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-2 bg-bg01/70 border border-stroke01 hover:border-stroke01 transition-colors"
                      >
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-bg02 to-bg03 flex items-center justify-center border border-stroke01 flex-shrink-0">
                          <Sparkles className="w-3 h-3 text-text02" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-medium text-text02 text-xs truncate">
                          {intent.label}
                        </span>
                          <span className="text-[10px] text-text03">
                            {intent.workflow}
                        </span>
                      </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-12 bg-stroke01 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: ["intent-ready", "telemetry", "running", "completed", "escalated"].includes(stage) && score > 0
                                  ? `${Math.min(100, score * 25)}%`
                                  : 0,
                            }}
                              transition={{ duration: 0.5, delay: (idx + 1) * 0.08 + 0.4 }}
                              className="h-1.5 rounded-full bg-text03"
                          />
                        </div>
                          <span className="text-[10px] text-text03 w-8 text-right">{(score * 25).toFixed(0)}%</span>
                      </div>
                    </motion.div>
                    ))}
                  </div>
                )}

                {!intentScores.length && (
                  <p className="text-xs text-text03 text-center py-2">
                    Start speaking or typing to see how we route to a workflow.
                  </p>
                )}
              </div>
            )}
            <p className="mt-1 text-[11px] text-text03">
              {selectedWorkflow === "unknown"
                ? "No matching workflow found. Escalating to human agent with full context."
                : "Intent successfully classified and mapped to resolution workflow."}
            </p>
          </motion.div>

          {/* Column 3: Telemetry Snapshot – Enhanced with rich data */}
          <motion.div
            animate={{
              boxShadow:
                stage === "telemetry"
                  ? "0 12px 30px rgba(254,189,23,0.35)"
                  : "0 2px 8px rgba(15,23,42,0.08)",
            }}
            transition={{ duration: 0.3 }}
            className={`relative rounded-xl px-5 py-5 flex flex-col gap-4 transition-all duration-300 border-2 h-[320px] overflow-y-auto ${
              stage === "telemetry" ? "border-text01 bg-bg01 shadow-lg" : "border-stroke01 bg-bg01 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AvatarCircle
                active={stage === "telemetry"}
                pulse={stage === "telemetry"}
                icon={<Cpu className="w-4 h-4" />}
              />
                <p className="text-lg font-bold text-text01 ">Input Datapoints</p>
            </div>
              {stage === "telemetry" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-alert01 border border-alert01"
                >
                  <Activity className="w-3 h-3 text-amber-700 animate-pulse" />
                  <span className="text-[10px] font-semibold text-amber-700">Scanning...</span>
                </motion.div>
              )}
            </div>
            
            {/* Show waiting state until customer provides input */}
            {!interactionText || !detectedDevice ? (
              <div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
                <Cpu className="w-12 h-12 text-stroke01 mb-3" />
                <p className="text-sm font-medium text-text03 mb-1">Waiting for customer input...</p>
                <p className="text-xs text-text03">
                  Telemetry will be captured once the issue is described
                </p>
              </div>
            ) : (
              <>
                <p className="text-[11px] text-text03">{telemetryStatus}</p>
                
                <div className="mt-1 space-y-2">
                  {/* Show detected device type badge */}
                  <div className={`rounded-lg p-3 border ${
                    detectedDevice === 'laptop' ? 'bg-neutral01 border-neutral01' :
                    detectedDevice === 'printer' ? 'bg-bg02  border-stroke01' :
                    'bg-bg02  border-stroke01'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Cpu className={`w-4 h-4 ${
                        detectedDevice === 'laptop' ? 'text-neutral02' :
                        detectedDevice === 'printer' ? 'text-text01 ' :
                        'text-text02'
                      }`} />
                      <span className={`text-xs font-semibold ${
                        detectedDevice === 'laptop' ? 'text-neutral02' :
                        detectedDevice === 'printer' ? 'text-text01 ' :
                        'text-text01 '
                      }`}>
                        Detected Device: {detectedDevice === 'laptop' ? 'Laptop' : detectedDevice === 'printer' ? 'Printer' : 'Computer'}
                      </span>
                    </div>
                  </div>

                  {/* Now show appropriate telemetry based on detected device */}
                  {detectedDevice === 'laptop' ? (
                    <>
                      {/* Compact laptop telemetry - dashboard style */}
                      <div className="text-[11px] space-y-2">
                        {/* Device Info - Inline */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                          <div className="flex justify-between">
                            <span className="text-text03">Model:</span>
                            <span className="font-semibold text-text01">Dell Latitude 5520</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text03">Serial:</span>
                            <span className="font-mono text-text01 text-[10px]">DL5520X789</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text03">OS:</span>
                            <span className="text-text01">Win 11 Pro</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text03">RAM:</span>
                            <span className="text-text01">16GB</span>
                          </div>
                        </div>

                        <div className="border-t border-stroke01 pt-2"></div>

                        {/* Status - Compact */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <AlertCircle className="w-3 h-3 text-error02" />
                              <span className="text-text03">Power:</span>
                            </div>
                            <span className="font-semibold text-error02">Issues Detected</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <AlertCircle className="w-3 h-3 text-alert02" />
                              <span className="text-text03">Display:</span>
                            </div>
                            <span className="text-alert02">Flickering</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Activity className="w-3 h-3 text-text03" />
                              <span className="text-text03">Battery:</span>
                            </div>
                            <span className="text-text02">45%</span>
                          </div>
                        </div>

                        <div className="border-t border-stroke01 pt-2"></div>

                        {/* Network - Compact */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-success02" />
                              <span className="text-text03">WiFi:</span>
                            </div>
                            <span className="text-success02">Connected</span>
                          </div>
                          <div className="flex justify-between pl-5">
                            <span className="text-text03">IP:</span>
                            <span className="font-mono text-text01 text-[10px]">192.168.1.105</span>
                          </div>
                        </div>

                        <div className="border-t border-success01 pt-2 mt-2 bg-success01/50 -mx-2 px-2 py-1.5 rounded">
                          <div className="flex items-center gap-1.5 text-success02">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="font-semibold text-[10px]">Premium Support • 24/7 Coverage</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : detectedDevice === 'printer' ? (
                <>
                  {/* Compact printer telemetry - dashboard style */}
                  <div className="text-[11px] space-y-2">
                    {/* Device Info - Inline */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                      <div className="flex justify-between">
                        <span className="text-text03">Model:</span>
                        <span className="font-semibold text-text01">HP LJ 4200</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text03">Serial:</span>
                        <span className="font-mono text-text01 text-[10px]">CNBJW12345</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text03">Firmware:</span>
                        <span className="text-text01">v1.2.3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text03">OS:</span>
                        <span className="text-text01">Win 11 Pro</span>
                      </div>
                    </div>

                    <div className="border-t border-stroke01 pt-2"></div>

                    {/* Network - Compact with errors */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3 text-error02" />
                          <span className="text-text03">Connection:</span>
                        </div>
                        <span className="font-semibold text-error02">Offline</span>
                      </div>
                      <div className="flex justify-between pl-5">
                        <span className="text-text03">IP:</span>
                        <span className="text-text03 text-[10px]">Not reachable</span>
                      </div>
                      <div className="flex justify-between pl-5">
                        <span className="text-text03">Gateway:</span>
                        <span className="text-text03 text-[10px]">192.168.1.1</span>
                      </div>
                      <div className="flex justify-between pl-5">
                        <span className="text-text03">Port:</span>
                        <span className="text-error02 text-[10px]">9100 (Timeout)</span>
                      </div>
                    </div>

                    <div className="border-t border-stroke01 pt-2"></div>

                    {/* Print Queue - Compact */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-alert02" />
                          <span className="text-text03">Queue:</span>
                        </div>
                        <span className="font-semibold text-alert02">7 jobs</span>
                      </div>
                      <div className="flex justify-between pl-5">
                        <span className="text-text03">Spooler:</span>
                        <span className="text-error02">Unhealthy</span>
                      </div>
                      <div className="flex justify-between pl-5">
                        <span className="text-text03">Last Job:</span>
                        <span className="text-text02">3 min ago</span>
                      </div>
                    </div>

                    <div className="border-t border-success01 pt-2 mt-2 bg-success01/50 -mx-2 px-2 py-1.5 rounded">
                      <div className="flex items-center gap-1.5 text-success02">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="font-semibold text-[10px]">Gold Support • Replacement Eligible</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Device Info */}
                  <div className="bg-bg01 rounded-lg p-3 border border-stroke01 space-y-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-bg03">
                      <Cpu className="w-3.5 h-3.5 text-text02" />
                      <span className="text-xs font-semibold text-text01">Device Information</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-text03">Model:</span>
                        <p className="font-semibold text-text01">Canon PIXMA XL-500</p>
                      </div>
                      <div>
                        <span className="text-text03">Serial:</span>
                        <p className="font-mono text-text01">CNPX987654</p>
                      </div>
                      <div>
                        <span className="text-text03">Firmware:</span>
                        <p className="text-text01">v3.4.5</p>
                      </div>
                      <div>
                        <span className="text-text03">OS:</span>
                        <p className="text-text01">macOS 14.2</p>
                      </div>
                    </div>
                  </div>

                  {/* Ink Status */}
                  <div className="bg-bg01 rounded-lg p-3 border border-alert01 space-y-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-alert01">
                      <AlertCircle className="w-3.5 h-3.5 text-alert02" />
                      <span className="text-xs font-semibold text-amber-900">Ink Cartridges</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-text03">Black:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-stroke01 rounded-full h-1.5">
                            <div className="bg-text01 h-1.5 rounded-full" style={{width: "70%"}} />
                          </div>
                          <span className="font-semibold text-text01">70%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text03">Cyan:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-stroke01 rounded-full h-1.5">
                            <div className="bg-neutral010 h-1.5 rounded-full" style={{width: "40%"}} />
                          </div>
                          <span className="font-semibold text-alert02">40%</span>
                        </div>
                      </div>
                      <div className="px-2 py-1.5 bg-error01 border border-error01 rounded text-error02 mt-2">
                        Error: INK_AUTH_001 - Cartridge not recognized
                      </div>
                    </div>
                  </div>

                  {/* Network Status */}
                  <div className="bg-bg01 rounded-lg p-3 border border-stroke01 space-y-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-bg03">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success02" />
                      <span className="text-xs font-semibold text-text01">Network Status</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-text03">Connection:</span>
                        <span className="font-semibold text-success02">Online</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text03">IP Address:</span>
                        <span className="font-mono text-text01">192.168.1.150</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text03">WiFi Signal:</span>
                        <span className="text-success02">Strong (92%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Status */}
                  <div className="bg-neutral01 rounded-lg p-3 border border-neutral01 space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-neutral02 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ink Subscription Active
                    </div>
                    <p className="text-neutral02">Auto-ship enabled • Next delivery: 5 days</p>
                  </div>
                </>
              )}
            </div>
                
                <p className="mt-2 text-[10px] text-text03 italic border-t border-stroke01 pt-2">
                  ✓ Context-aware telemetry based on customer's actual device
                </p>
              </>
          )}
          </motion.div>
        </div>
        {/* End of 3-column grid */}

        {/* Handoff Strip - Visual connection between Genesys and Workflow */}
        {selectedGenesysConversation && interactionText && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="mt-4 px-4 py-3 bg-gradient-to-r from-neutral01 via-neutral01 to-tertiary border-2 border-neutral01 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Activity className="w-4 h-4 text-neutral02" />
                  <span className="text-xs font-bold text-text02 ">Genesys Conversation:</span>
                  <span className="text-xs font-mono text-text02 truncate">
                    {selectedGenesysConversation.id?.substring(0, 12)}...
                  </span>
                </div>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex-shrink-0"
                >
                  <ArrowRight className="w-4 h-4 text-neutral02" />
                </motion.div>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-xs font-bold text-text02 ">FAB Agents Workflow:</span>
                  <span className="text-xs font-mono font-bold bg-text01 text-bg01 px-2 py-0.5 rounded border border-stroke01">
                    {selectedWorkflow || 'printer_offline'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="px-2 py-1 bg-success01 border border-success03 rounded-full">
                  <span className="text-[10px] font-bold text-success02">Handoff Active</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Timeline Rail - Workflow Stages Progress */}
        {interactionText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 px-4 py-3 bg-bg01 border-2 border-stroke01  rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              {[
                { label: 'Capture', stage: 'capture', icon: User },
                { label: 'Intent', stage: 'intent-ready', icon: Brain },
                { label: 'Knowledge', stage: 'knowledge-ready', icon: BookOpen },
                { label: 'Telemetry', stage: 'telemetry', icon: Cpu },
                { label: 'Action', stage: 'running', icon: Zap },
                { label: 'Escalation', stage: 'escalated', icon: AlertCircle },
              ].map((step, idx) => {
                const isActive = stage === step.stage || 
                  (step.stage === 'capture' && ['capture', 'intent-detecting', 'intent-ready', 'knowledge-ready', 'telemetry', 'running', 'completed', 'escalated'].includes(stage)) ||
                  (step.stage === 'intent-ready' && ['intent-ready', 'knowledge-ready', 'telemetry', 'running', 'completed', 'escalated'].includes(stage)) ||
                  (step.stage === 'knowledge-ready' && ['knowledge-ready', 'telemetry', 'running', 'completed', 'escalated'].includes(stage)) ||
                  (step.stage === 'telemetry' && ['telemetry', 'running', 'completed', 'escalated'].includes(stage)) ||
                  (step.stage === 'running' && ['running', 'completed', 'escalated'].includes(stage)) ||
                  (step.stage === 'escalated' && stage === 'escalated');
                const isCompleted = ['completed', 'escalated'].includes(stage) && idx < 5;
                const Icon = step.icon;
                
                return (
                  <div key={step.stage} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                        isActive
                          ? 'bg-text01 border-text01 text-bg01 shadow-md scale-110'
                          : isCompleted
                          ? 'bg-success01 border-success03 text-success02'
                          : 'bg-bg02  border-stroke01 text-text03'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-semibold mt-1 ${
                        isActive
                          ? 'text-text01 '
                          : isCompleted
                          ? 'text-success02'
                          : 'text-text03'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {idx < 5 && (
                      <div className={`flex-1 h-0.5 mx-2 transition-all ${
                        isCompleted || (isActive && idx < 4)
                          ? 'bg-gradient-to-r from-text01 to-success010'
                          : 'bg-stroke01 '
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Workflow Outcome - AI Console Output */}
        <motion.div
          animate={{
            boxShadow: ["completed"].includes(stage)
              ? "0 8px 24px rgba(16,185,129,0.15)"
              : stage === "escalated"
              ? "0 8px 24px rgba(245,158,11,0.15)"
              : "0 2px 8px rgba(15,23,42,0.06)",
          }}
          transition={{ duration: 0.3 }}
          className={`relative rounded-xl overflow-hidden px-5 py-5 flex flex-col gap-3 transition-all duration-300 border mt-6 ${
            stage === "completed"
              ? "border-success03 bg-success01"
            : stage === "escalated"
              ? "border-alert01 bg-alert01"
              : "border-stroke01  bg-bg01"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AvatarCircle
                active={["running", "completed", "escalated"].includes(stage)}
                pulse={["running"].includes(stage)}
                icon={<Zap className="w-4 h-4" />}
              />
              <p className="text-sm font-semibold text-text01">Workflow outcome</p>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                stage === "escalated"
                  ? "bg-pinkTP/20 text-rose-700"
                  : stage === "completed"
                  ? "bg-success01 text-success02"
                  : "bg-bg02 text-text02"
              }`}
            >
              {stage === "escalated" ? "Escalated" : stage === "completed" ? "Self-healed" : "Running"}
            </span>
          </div>
          <div className="mt-2 text-sm text-text02 space-y-1.5">
            {currentOutcome ? (
              <>
                <p>
                  <span className="font-medium text-text02">Summary:</span>{" "}
                  <span className="font-semibold text-text01">{currentOutcome.summary}</span>
                </p>
                <p>
                  <span className="font-medium text-text02">{currentOutcome.kpiLabel}:</span>{" "}
                  <span className="font-semibold text-text01">{currentOutcome.kpi}</span>
                </p>
                {currentOutcome.ticketUrl && (
                  <div className="mt-2">
                    <a
                      href={currentOutcome.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neutral01 text-neutral02 hover:bg-neutral01 border border-neutral01"
                    >
                      <Cloud className="w-3 h-3" />
                      View in {currentOutcome.systemName}
                    </a>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-text03">
                We'll show the summary once the first workflow run completes.
              </p>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-[11px] text-text03 flex-1">
              Executes actions, verifies outcome, and only escalates when necessary.
            </p>
            {stage === "escalated" && !ticketConfirmed && (
              <button
                type="button"
                onClick={() => setShowTicketModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-neutral02 text-bg01 hover:bg-textLink shadow-sm"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Create ticket in IT system
              </button>
            )}
            {stage === "escalated" && ticketConfirmed && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-success01 text-success02 border border-success01">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ticket created in IT system
              </span>
            )}
          </div>
        </motion.div>

      {/* Workflow engine runner - processes workflows and updates status.
          For unknown intents we skip this runner, since we escalate immediately instead of invoking a playbook. */}
      {selectedWorkflow !== "unknown" && (
        <div className="hidden">
          <AgenticSupportDemo
            embedded={true}
            initialWorkflow={selectedWorkflow}
            interactionText={interactionText}
            autoRunToken={autoRunToken}
            onWorkflowComplete={async (result) => {
              setLastResult(result);
              
              // Auto-create ticket for ALL workflows (self-healing + escalated)
              try {
                const ticketData = {
                  workflow: selectedWorkflow,
                  interactionText: interactionText,
                  detectedDevice: detectedDevice,
                  diagnosis: result?.diagnosis,
                  actions: result?.actions || [],
                  status: result?.escalation?.required ? 'escalated' : 'resolved',
                  category: selectedWorkflow === 'printer_offline' ? 'Printer Offline on Floor 3' : 
                           selectedWorkflow === 'ink_error' ? 'Genuine Ink Not Recognized' : 
                           'Unknown Category',
                  escalationReason: result?.escalation?.reason,
                  ticketId: result?.escalation?.ticket_id,
                };
                
                const ticketResult = await createTicket(ticketData, selectedTicketingSystem);
                setTicketResult(ticketResult);
                setTicketConfirmed(true);
                // Show confirmation modal for both self-healed and escalated flows
                setShowTicketModal(true);
                
                // Save ticket to storage for Watchtower
                const ticketToSave = {
                  id: ticketResult.ticketId || `TKT-${Date.now()}`,
                  ticketId: ticketResult.ticketId,
                  ticketUrl: ticketResult.url,
                  ticketSystem: ticketResult.system,
                  workflow: selectedWorkflow,
                  category: ticketData.category,
                  interactionText: interactionText,
                  detectedDevice: detectedDevice,
                  status: ticketData.status,
                  diagnosis: result?.diagnosis,
                  actions: result?.actions || [],
                  escalationReason: result?.escalation?.reason,
                  knowledgeBase: knowledgeBaseRef || (selectedWorkflow === 'printer_offline' 
                    ? 'Printer_Guide.pdf p.12-15'
                    : selectedWorkflow === 'ink_error'
                    ? 'Ink_Error_Resolution.pdf p.8-10'
                    : null),
                  createdAt: ticketResult.createdAt || new Date().toISOString(),
                  timestamp: new Date().toISOString(),
                };
                saveTicket(ticketToSave);
                
                // Update result with ticket info
                const updatedResult = {
                  ...result,
                  ticket: {
                    ticket_id: ticketResult.ticketId,
                    ticket_url: ticketResult.url,
                    ticket_system: ticketResult.system,
                    created_at: ticketResult.createdAt,
                  },
                };
                
                if (result?.escalation?.required) {
                  updatedResult.escalation = {
                    ...result.escalation,
                    ticket_id: ticketResult.ticketId,
                    ticket_url: ticketResult.url,
                    ticket_system: ticketResult.system,
                  };
                }
                
                setLastResult(updatedResult);
              } catch (error) {
                console.error("Failed to auto-create ticket:", error);
              }
              
              // Set final stage
              if (result?.escalation?.required) {
                setStage("escalated");
              } else {
                setStage("completed");
              }
            }}
          />
        </div>
      )}
      
      </div>

      {/* Ticket confirmation / summary modal */}
      {showTicketModal && lastResult && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-bg01 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-stroke01">
            <h2 className="text-base font-semibold text-text01 mb-1">
              Create ticket in your IT system?
            </h2>
            <p className="text-sm text-text02 mb-3">
              We'll send this incident, along with the captured customer text and telemetry snapshot, into your ITSM / CRM
              platform (e.g., ServiceNow, Salesforce, SAP, etc.) as a ready-to-work ticket.
            </p>
            {/* Ticketing System Selection */}
            <div className="mb-4 rounded-lg bg-neutral01 border border-neutral01 px-3 py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-neutral02 text-xs font-medium">
                  <Cloud className="w-3.5 h-3.5" />
                  Ticketing System
                </div>
                <select
                  value={selectedTicketingSystem}
                  onChange={(e) => setSelectedTicketingSystem(e.target.value)}
                  className="text-[11px] px-2 py-1 rounded border border-neutral01 bg-bg01 text-neutral02 focus:ring-1 focus:ring-neutral010"
                  disabled={ticketCreating}
                >
                  {availableSystems.map((sys) => (
                    <option key={sys.id} value={sys.id}>
                      {sys.icon} {sys.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-neutral02">
                {selectedTicketingSystem === "servicenow" && "Ticket will be created via ServiceNow REST API (POST /api/now/table/incident) with full context payload."}
                {selectedTicketingSystem === "jira" && "Issue will be created via Jira REST API (POST /rest/api/3/issue) with full context payload."}
                {selectedTicketingSystem === "zendesk" && "Ticket will be created via Zendesk REST API (POST /api/v2/tickets.json) with full context payload."}
                {selectedTicketingSystem === "salesforce" && "Case will be created via Salesforce REST API (POST /services/data/v58.0/sobjects/Case) with full context payload."}
              </p>
            </div>
            <div className="mt-2 mb-4 flex items-center justify-between bg-bg02 border border-stroke01 rounded-xl px-3 py-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-text03 font-medium">
                  Ticket ID
                </p>
                <p className="font-mono text-sm text-text01">
                  {lastResult.escalation.ticket_id}
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const id = lastResult?.escalation?.ticket_id;
                  if (!id) return;
                  try {
                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                      await navigator.clipboard.writeText(id);
                      setTicketCopied(true);
                      setTimeout(() => setTicketCopied(false), 2000);
                    }
                  } catch {
                    // ignore copy failures
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium border ${
                  ticketCopied
                    ? "bg-success01 text-success02 border-success01"
                    : "bg-bg01 text-text02 border-stroke01 hover:border-stroke01"
                }`}
              >
                {ticketCopied ? "Copied" : "Copy ID"}
              </button>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowTicketModal(false);
                  setTicketCopied(false);
                }}
                className="px-3 py-1.5 rounded-full text-[12px] font-medium text-text02 bg-bg02 hover:bg-stroke01"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!lastResult?.escalation) return;
                  
                  setTicketCreating(true);
                  try {
                    // Prepare ticket data
                    const ticketData = {
                      interactionText,
                      telemetry: lastResult.telemetry || {},
                      diagnosis: lastResult.diagnosis || {},
                      escalationReason: lastResult.escalation.reason,
                      ticketId: lastResult.escalation.ticket_id,
                    };
                    
                    // Create ticket via service with selected system
                    const result = await createTicket(ticketData, selectedTicketingSystem);
                    
                    setTicketResult(result);
                    setTicketConfirmed(true);
                    setShowTicketModal(false);
                    
                    // Save ticket to storage for Watchtower
                    const ticketToSave = {
                      id: result.ticketId || `TKT-${Date.now()}`,
                      ticketId: result.ticketId,
                      ticketUrl: result.url,
                      ticketSystem: result.system,
                      workflow: selectedWorkflow,
                      category: lastResult?.category || "Unknown",
                      interactionText: interactionText,
                      detectedDevice: detectedDevice,
                      status: lastResult?.escalation?.required ? "escalated" : "resolved",
                      diagnosis: lastResult?.diagnosis,
                      actions: lastResult?.actions || [],
                      escalationReason: lastResult?.escalation?.reason,
                      knowledgeBase: lastResult?.knowledgeBase || null,
                      createdAt: result.createdAt || new Date().toISOString(),
                      timestamp: new Date().toISOString(),
                    };
                    saveTicket(ticketToSave);
                    
                    // Update lastResult with actual ticket info
                    setLastResult({
                      ...lastResult,
                      escalation: {
                        ...lastResult.escalation,
                        ticket_id: result.ticketId,
                        ticket_url: result.url,
                        ticket_system: result.system,
                      },
                    });
                  } catch (error) {
                    console.error("Failed to create ticket:", error);
                    alert(`Failed to create ticket: ${error.message}`);
                  } finally {
                    setTicketCreating(false);
                  }
                }}
                disabled={ticketCreating}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold bg-neutral02 text-bg01 hover:bg-textLink shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ticketCreating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Creating ticket...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Confirm &amp; create ticket
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Agent Orchestration - Always Visible with Animations */}
      {timeline.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-bg01 border-2 border-stroke01 shadow-shadow-drop overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-text01 to-buttonPrimary-hover px-6 py-4 border-b-2 border-stroke01">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Sparkles className="w-6 h-6 text-bg01" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
                    <Sparkles className="w-6 h-6 text-bg01/30 opacity-50" />
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-bg01 drop-shadow-sm">AI Agent Orchestration</h3>
                  <p className="text-xs text-bg01 drop-shadow-sm">Real-time multi-agent reasoning trace</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentProcessingAgent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1.5 rounded-full bg-alert010/30 backdrop-blur-sm border border-alert02/50"
                  >
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 text-alert02 animate-spin" />
                      <span className="text-xs font-semibold text-bg01">
                        Processing: {currentProcessingAgent}
                      </span>
                      {processingStartTime && (
                        <span className="text-[10px] text-bg01/80">
                          ({Math.floor((new Date() - processingStartTime) / 1000)}s)
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
                <div className="px-3 py-1.5 rounded-full bg-bg01/20 backdrop-blur-sm border border-white/30">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success03 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success03" />
                    </span>
                    <span className="text-xs font-semibold text-bg01">{timeline.length} Agents Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Info Banner */}
          <div className="bg-bg01 px-6 py-3 border-b-2 border-stroke01">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-text01 " />
                <span className="font-semibold text-text01 ">Workflow:</span>
                <span className="font-mono font-bold bg-text01 text-bg01 px-2.5 py-1 rounded border-2 border-text01">
                    {selectedWorkflow === "printer_offline" ? "printer_offline" : "ink_error"}
                  </span>
                </div>
                {interactionText && (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MessageCircle className="w-4 h-4 text-text02 flex-shrink-0" />
                  <span className="text-text01  truncate italic">"{interactionText.substring(0, 80)}..."</span>
                </div>
                )}
            </div>
              </div>

          {/* Agent Steps - Beautiful Timeline */}
          <div className="px-6 py-6">
            <div className="relative">
              {/* Animated connecting line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-stroke01 via-text03 to-stroke01" />
              
              <div className="space-y-4">
                  {timeline.map((step, idx) => (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15, duration: 0.4 }}
                    className="relative"
                  >
                    <div className="flex items-start gap-4">
                      {/* Agent Icon with Glow */}
                      <div className="relative z-10 flex-shrink-0">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                          className="relative"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-bg01 border-2 shadow-lg ${step.color} relative`}>
                            {step.icon}
                            {/* Pulse effect for active agents */}
                            {idx === timeline.length - 1 && (
                              <motion.span
                                className={`absolute inset-0 rounded-full ${step.bg} opacity-50`}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                          </div>
                          {/* Number badge */}
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-text01 to-buttonPrimary-hover flex items-center justify-center shadow-md border-2 border-white">
                            <span className="text-[10px] font-bold text-bg01">{idx + 1}</span>
                        </div>
                        </motion.div>
                      </div>

                      {/* Agent Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.15 + 0.3, duration: 0.4 }}
                        className="flex-1 group"
                      >
                        <div className="rounded-xl bg-bg01 border-2 border-stroke01 hover:border-text01  transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
                          {/* Agent Header */}
                          <div className={`px-4 py-2.5 border-b-2 ${
                            currentProcessingAgent === step.label
                              ? 'bg-alert01 border-alert01'
                              : 'bg-bg02  border-stroke01'
                          }`}>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className={`font-bold text-sm ${step.color} truncate`}>
                                  {step.label}
                              </span>
                                {currentProcessingAgent === step.label && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="px-2 py-0.5 rounded-full bg-gradient-to-r from-alert02 to-alert010 text-bg01 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm"
                                  >
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Processing
                                  </motion.span>
                                )}
                                {idx === timeline.length - 1 && !currentProcessingAgent && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="px-2 py-0.5 rounded-full bg-gradient-to-r from-success03 to-success010 text-bg01 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    Final
                                  </motion.span>
                            )}
                          </div>
                              <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ delay: idx * 0.15 + 0.5, duration: 0.6 }}
                              >
                                <Sparkles className={`w-3.5 h-3.5 ${step.color} opacity-50`} />
                              </motion.div>
                        </div>
                      </div>

                          {/* Agent Body */}
                          <div className="px-4 py-3 bg-bg01">
                            <p className="text-xs text-text01  leading-relaxed whitespace-pre-wrap">
                              {step.body}
                            </p>
                          </div>

                          {/* Progress indicator for final step */}
                          {idx === timeline.length - 1 && (
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: idx * 0.15 + 0.6, duration: 0.8 }}
                              className="h-1 bg-gradient-to-r from-text01 via-buttonPrimary-hover to-success010 origin-left"
                            />
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                  ))}
                </div>
              </div>
          </div>

          {/* Footer - Final Status */}
          <div className="bg-bg02 /50 px-6 py-4 border-t border-stroke01 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success02" />
                <span className="text-sm font-semibold text-text01">
                  Workflow Status: <span className="text-success02">{lastResult?.status || "Completed"}</span>
                </span>
          </div>
              <div className="flex items-center gap-2 text-xs text-text02">
                <Clock className="w-4 h-4" />
                <span>Total execution time: <span className="font-semibold">~{(timeline.length * 0.8).toFixed(1)}s</span></span>
        </div>
            </div>
          </div>
        </motion.div>
      )}
      {/* Knowledge Base Document Viewer */}
      {showDocViewer && (
        <KnowledgeDocViewer
          workflow={selectedWorkflow}
          initialPage={docViewerPage}
          onClose={() => setShowDocViewer(false)}
        />
      )}
      </div>
    </div>
  );
}



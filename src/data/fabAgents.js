export const fabAgents = [
  // TP FAB Agents Platform - CCAS Support Workflows (Row 1: Reasoning Agents)
  {
    id: "intent-detection",
    name: "Intent Detection Agent",
    category: "Reasoning",
    maturity: "Production",
    framework: "LangGraph",
    signal: "Live",
    description:
      "Classifies customer intents using multi-class LLM reasoning, matching queries to known workflows with confidence scoring.",
    definition:
      "Advanced intent classification agent that uses GPT-4 reasoning to categorize customer queries, identify workflow matches, and provide alternative intent suggestions with confidence scores.",
    inputs: ["Customer query", "Context history", "Workflow catalog"],
    outputs: ["Primary intent", "Confidence score", "Alternative intents", "Category"],
    metrics: [
      { label: "Accuracy", value: "94.3%" },
      { label: "False positives", value: "< 2%" },
    ],
    stack: ["GPT-4o", "LangGraph", "Vector search"],
    applications: ["TP FAB Agents"],
    ctaLabel: "View agent",
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base Agent",
    category: "Reasoning",
    maturity: "Production",
    framework: "LangGraph",
    signal: "Live",
    description:
      "Retrieves relevant knowledge base documents using semantic search and RAG, providing context-aware answers and troubleshooting steps.",
    definition:
      "RAG-powered knowledge retrieval agent that performs semantic search across knowledge bases, retrieves relevant documents, and generates contextual responses with citations.",
    inputs: ["Query", "Workflow context", "Knowledge base"],
    outputs: ["Relevant documents", "Answer snippets", "Confidence", "Citations"],
    metrics: [
      { label: "Recall", value: "92%" },
      { label: "Relevance", value: "96%" },
    ],
    stack: ["RAG", "Vector DB", "GPT-4", "LangGraph"],
    applications: ["TP FAB Agents", "Cogniclaim"],
    ctaLabel: "View agent",
  },
  {
    id: "diagnostic",
    name: "Diagnostic Agent",
    category: "Reasoning",
    maturity: "Production",
    framework: "LangGraph",
    signal: "Live",
    description:
      "Performs root cause analysis by analyzing symptoms, telemetry data, and historical patterns to identify issue causes.",
    definition:
      "Intelligent diagnostic agent that combines customer-reported symptoms with device telemetry, historical data, and knowledge base insights to determine root causes.",
    inputs: ["Symptoms", "Telemetry data", "Device info", "History"],
    outputs: ["Root cause", "Confidence", "Evidence", "Alternative causes"],
    metrics: [
      { label: "Diagnosis accuracy", value: "91%" },
      { label: "Time to diagnose", value: "< 5s" },
    ],
    stack: ["GPT-4", "LangGraph", "Telemetry API"],
    applications: ["TP FAB Agents"],
    ctaLabel: "View agent",
  },
  // Row 2: Input Processing + Responsible AI
  {
    id: "voice-capture",
    name: "Voice Capture Agent",
    category: "Input Processing",
    maturity: "Production",
    framework: "LangGraph",
    signal: "Live",
    description:
      "Captures and transcribes voice interactions from CCAS channels, extracting customer intent and context from real-time audio streams.",
    definition:
      "Multi-channel voice capture agent that processes audio streams, performs speech-to-text conversion, and extracts structured metadata including speaker identification, sentiment, and key phrases.",
    inputs: ["Audio streams", "Channel metadata", "Session context"],
    outputs: ["Transcribed text", "Speaker labels", "Sentiment score", "Key phrases"],
    metrics: [
      { label: "Accuracy", value: "96.2%" },
      { label: "Latency", value: "< 2s" },
    ],
    stack: ["Whisper API", "LangGraph", "FreeSWITCH"],
    applications: ["TP FAB Agents"],
    ctaLabel: "View agent",
  },
  {
    id: "chat-capture",
    name: "Chat Capture Agent",
    category: "Input Processing",
    maturity: "Production",
    framework: "LangGraph",
    signal: "Live",
    description:
      "Processes chat interactions from web, mobile, and messaging platforms, extracting structured conversation data and customer context.",
    definition:
      "Real-time chat processing agent that captures multi-turn conversations, identifies customer queries, and structures interaction data for downstream agents.",
    inputs: ["Chat messages", "Session history", "User profile"],
    outputs: ["Structured query", "Conversation context", "Customer intent"],
    metrics: [
      { label: "Throughput", value: "1.2k/min" },
      { label: "Context retention", value: "100%" },
    ],
    stack: ["LangGraph", "WebSocket", "Message queue"],
    applications: ["TP FAB Agents"],
    ctaLabel: "View agent",
  },
  {
    id: "responsible-ai",
    name: "Responsible AI Agent",
    category: "Trust & Safety",
    maturity: "Production",
    framework: "LangGraph",
    signal: "SOC2 ready",
    description:
      "Ensures AI outputs meet ethical standards, compliance requirements, and policy guardrails across all agent workflows and decisions.",
    definition:
      "Cross-cutting responsible AI agent that monitors, validates, and enforces ethical AI practices, bias detection, fairness checks, compliance guardrails, and audit trail generation for all AI-powered decisions and recommendations.",
    inputs: ["AI outputs", "Policy rules", "Compliance requirements", "Audit context"],
    outputs: ["Validation status", "Bias scores", "Compliance flags", "Audit logs", "Guardrail violations"],
    metrics: [
      { label: "Compliance rate", value: "99.2%" },
      { label: "Bias detection", value: "100%" },
    ],
    stack: ["Policy engine", "Bias detection models", "Audit framework", "LangGraph", "GPT-4"],
    applications: ["TP FAB Agents", "Cogniclaim", "TP Resolve", "TP Dispatch"],
    ctaLabel: "View agent",
  },
  // Row 3: Execution Agents
  {
    id: "email-parsing",
    name: "Email Parsing Agent",
    category: "Input Processing",
    maturity: "Production",
    framework: "LangGraph",
    signal: "Live",
    description:
      "Parses and structures email communications, extracting customer issues, attachments, and metadata for workflow routing.",
    definition:
      "Intelligent email parsing agent that extracts structured information from email content, identifies attachments, and routes to appropriate workflow agents.",
    inputs: ["Email content", "Attachments", "Headers"],
    outputs: ["Structured issue", "Attachment metadata", "Priority score"],
    metrics: [
      { label: "Parse accuracy", value: "98.5%" },
      { label: "Attachment handling", value: "100%" },
    ],
    stack: ["LangGraph", "PDF parser", "Email API"],
    applications: ["TP FAB Agents"],
    ctaLabel: "View agent",
  },
  {
    id: "action-execution",
    name: "Action Execution Agent",
    category: "Execution",
    maturity: "Production",
    framework: "LangGraph",
    signal: "Live",
    description:
      "Executes self-healing actions based on diagnostic results, performing automated remediation steps with verification.",
    definition:
      "Automated action execution agent that performs self-healing operations such as device resets, configuration changes, and network adjustments based on diagnostic outcomes.",
    inputs: ["Diagnosis", "Action plan", "Device credentials"],
    outputs: ["Action status", "Execution log", "Result"],
    metrics: [
      { label: "Success rate", value: "87%" },
      { label: "Execution time", value: "< 10s" },
    ],
    stack: ["LangGraph", "Device APIs", "Action library"],
    applications: ["TP FAB Agents"],
    ctaLabel: "View agent",
  },
  {
    id: "verification",
    name: "Verification Agent",
    category: "Execution",
    maturity: "Production",
    framework: "LangGraph",
    signal: "Live",
    description:
      "Verifies that executed actions resolved the issue by checking device status, customer feedback, and telemetry signals.",
    definition:
      "Post-action verification agent that validates remediation success by checking device state, running diagnostic tests, and confirming issue resolution.",
    inputs: ["Action result", "Device status", "Telemetry"],
    outputs: ["Verification status", "Confidence", "Next steps"],
    metrics: [
      { label: "Verification accuracy", value: "95%" },
      { label: "False positives", value: "< 3%" },
    ],
    stack: ["LangGraph", "Telemetry", "GPT-4"],
    applications: ["TP FAB Agents"],
    ctaLabel: "View agent",
  },
  // Row 4: Decision & Monitoring Agents
  {
    id: "escalation-decision",
    name: "Escalation Decision Agent",
    category: "Decision",
    maturity: "Production",
    framework: "LangGraph",
    signal: "Live",
    description:
      "Determines when to escalate issues to human agents based on complexity, policy boundaries, and resolution confidence.",
    definition:
      "Intelligent escalation decision agent that evaluates issue complexity, policy constraints, and resolution confidence to make escalation decisions with full context transfer.",
    inputs: ["Issue context", "Resolution confidence", "Policy rules"],
    outputs: ["Escalation decision", "Reason", "Context package"],
    metrics: [
      { label: "Escalation accuracy", value: "96%" },
      { label: "Context transfer", value: "100%" },
    ],
    stack: ["LangGraph", "Policy engine", "GPT-4"],
    applications: ["TP FAB Agents"],
    ctaLabel: "View agent",
  },
  {
    id: "anomaly-detection",
    name: "Anomaly Detection Agent",
    category: "Monitoring",
    maturity: "Beta",
    framework: "LangGraph",
    signal: "High velocity",
    description:
      "Detects anomalies in device telemetry, system behavior, and customer interactions using pattern recognition and statistical analysis.",
    definition:
      "Real-time anomaly detection agent that monitors telemetry streams, identifies unusual patterns, and triggers alerts for investigation or automated response.",
    inputs: ["Telemetry streams", "Historical baselines", "Pattern library"],
    outputs: ["Anomaly alerts", "Severity score", "Pattern match", "Recommendation"],
    metrics: [
      { label: "Detection rate", value: "94%" },
      { label: "False positives", value: "< 4%" },
    ],
    stack: ["Time-series analysis", "GPT-4", "LangGraph"],
    applications: ["TP FAB Agents", "TP Dispatch"],
    ctaLabel: "View agent",
  },
  // Other Applications (Cogniclaim, TP Resolve, TP Dispatch)
  {
    id: "sop-matching",
    name: "SOP Matching Agent",
    category: "Reasoning",
    maturity: "Production",
    framework: "LangChain",
    signal: "Live",
    description:
      "Matches analyzed claims to relevant Standard Operating Procedures (SOPs) using semantic search and rule-based matching.",
    definition:
      "SOP matching agent that uses RAG and semantic search to find applicable SOPs for claims, ensuring compliance with healthcare regulations and internal policies.",
    inputs: ["Analyzed claim", "SOP library", "State regulations"],
    outputs: ["Matched SOPs", "Relevance scores", "Compliance status"],
    metrics: [
      { label: "Match accuracy", value: "95%" },
      { label: "Coverage", value: "98%" },
    ],
    stack: ["RAG", "Vector DB", "LangChain", "GPT-4"],
    applications: ["Cogniclaim", "TP Resolve"],
    ctaLabel: "View agent",
  },
  {
    id: "risk-assessment",
    name: "Risk Assessment Agent",
    category: "Decision",
    maturity: "Production",
    framework: "LangChain",
    signal: "Live",
    description:
      "Assesses claim risk levels, identifies potential fraud indicators, and evaluates financial and compliance risks.",
    definition:
      "Risk assessment agent that analyzes claims for fraud patterns, compliance risks, and financial exposure using multi-factor analysis and historical patterns.",
    inputs: ["Claim data", "SOP matches", "Historical patterns"],
    outputs: ["Risk score", "Risk factors", "Recommendation"],
    metrics: [
      { label: "Risk detection", value: "93%" },
      { label: "False positives", value: "< 5%" },
    ],
    stack: ["GPT-4", "LangChain", "Risk models"],
    applications: ["Cogniclaim"],
    ctaLabel: "View agent",
  },
  {
    id: "recommendation",
    name: "Recommendation Agent",
    category: "Decision",
    maturity: "Production",
    framework: "LangChain",
    signal: "Live",
    description:
      "Generates actionable recommendations for claim processing, including approval, denial, or further investigation paths.",
    definition:
      "Final recommendation agent that synthesizes analysis, SOP matches, and risk assessment to provide clear, actionable recommendations with full reasoning trace.",
    inputs: ["Analysis", "SOP matches", "Risk assessment"],
    outputs: ["Recommendation", "Reasoning", "Confidence", "Next steps"],
    metrics: [
      { label: "Recommendation accuracy", value: "96%" },
      { label: "Adoption rate", value: "89%" },
    ],
    stack: ["GPT-4", "LangChain", "CoT reasoning"],
    applications: ["Cogniclaim"],
    ctaLabel: "View agent",
  },
  {
    id: "routing-agent",
    name: "Route Optimization Agent",
    category: "Optimization",
    maturity: "Production",
    framework: "LangGraph",
    signal: "Live",
    description:
      "Optimizes field service technician routes using AI-powered algorithms, considering traffic, skills, SLA, and customer preferences.",
    definition:
      "Intelligent routing agent that uses GPT-4 reasoning combined with optimization algorithms to generate optimal technician routes, balancing efficiency, SLA compliance, and customer satisfaction.",
    inputs: ["Work orders", "Technician locations", "Traffic data", "SLA constraints"],
    outputs: ["Optimized routes", "ETA", "SLA compliance", "Efficiency score"],
    metrics: [
      { label: "Route efficiency", value: "+18%" },
      { label: "SLA compliance", value: "96%" },
    ],
    stack: ["GPT-4", "LangGraph", "Routing algorithms"],
    applications: ["TP Dispatch"],
    ctaLabel: "View agent",
  },
  {
    id: "analysis-agent",
    name: "Claims Analysis Agent",
    category: "Reasoning",
    maturity: "Production",
    framework: "LangChain",
    signal: "Live",
    description:
      "Performs deep analysis of healthcare claims, extracting key information, identifying anomalies, and preparing data for SOP matching.",
    definition:
      "Multi-step analysis agent that processes claim documents, extracts structured data, identifies line items, and performs initial validation using GPT-4 reasoning.",
    inputs: ["Claim documents", "Member data", "Provider info"],
    outputs: ["Structured claim", "Anomalies", "Validation flags", "Line items"],
    metrics: [
      { label: "Extraction accuracy", value: "97.5%" },
      { label: "Processing time", value: "< 3s" },
    ],
    stack: ["GPT-4o", "LangChain", "Document parser"],
    applications: ["Cogniclaim"],
    ctaLabel: "View agent",
  },
];

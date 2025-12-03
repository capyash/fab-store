import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Layers,
  Globe,
  Users,
  Code,
  Activity,
  Brain,
  Server,
  Database,
  Shield,
  Lock,
  FileText,
  Network,
  Cpu,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react";
import { fabPlatforms } from "../data/fabPlatforms";
import { fabApps } from "../data/fabApps";

// Simple tooltip used only on hover over info icons
function Tooltip({ content, children }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <div className="absolute z-50 -top-2 left-1/2 -translate-x-1/2 -translate-y-full w-64 rounded-lg bg-gray-900 text-white text-xs px-3 py-2 shadow-xl border border-gray-700">
          {content}
        </div>
      )}
    </span>
  );
}

export default function ArchitecturePage({ onBack }) {
  const [viewMode, setViewMode] = useState("architecture"); // architecture | roi
  const [activeLayerId, setActiveLayerId] = useState("fab-store");

  const sopNavigator = fabPlatforms.find((p) => p.id === "sop-navigator");
  const solutions = fabApps.filter((a) => a.platformId === "sop-navigator");

  const layers = [
    {
      id: "fab-store",
      name: "FAB Store Layer",
      subtitle: "Unified Marketplace & Container",
      status: "Built",
      icon: Globe,
      description:
        "Central marketplace and shell that hosts all TP.ai solutions and platforms, providing navigation, discovery, and consistent UX.",
      bullets: [
        "Hosts solution UIs (Cogniclaim, TP Resolve) inside a single experience",
        "Provides navigation, search, and entry points into platforms",
        "Owns branding and top-level account context",
      ],
      details: [
        "Use this row to explain how leaders and clients first experience TP.ai – everything begins inside FAB Store.",
        "Call out that any new solution or platform will appear here without rebuilding navigation or marketing surfaces.",
      ],
    },
    {
      id: "presentation",
      name: "Presentation Layer",
      subtitle: "Solution User Interfaces",
      status: "Built",
      icon: Users,
      description:
        "Front-end surfaces for each solution: dashboards, worklists, AI consoles, and SOP viewers.",
      bullets: [
        "Cogniclaim UI: claims dashboards, worklists, AI Watchtower, SOP Viewer",
        "TP Resolve UI: case dashboards, deadline tracker, AI Watchtower",
        "Shared visual language and components across solutions",
      ],
      details: [
        "Explain that every solution UI is opinionated for its end‑user (claims examiners, grievance specialists, etc.).",
        "Point out AI Watchtower and SOP Viewer as consistent, reusable elements across UIs.",
      ],
    },
    {
      id: "solution",
      name: "Solution Layer",
      subtitle: "Industry-Specific Applications",
      status: "Built",
      icon: Code,
      description:
        "Domain-specific applications (Cogniclaim, TP Resolve) that implement industry workflows on top of platforms.",
      bullets: [
        "Cogniclaim: medical claims intelligence for payers",
        "TP Resolve: appeals & grievances resolution for regulated plans",
        "Adapters connect solution data models (claims/cases) to platform services",
      ],
      details: [
        "Make clear that Cogniclaim and TP Resolve are examples of vertical solutions built on a shared stack.",
        "Highlight that adapters mean a new solution can plug in its own data model but reuse the same AI and SOP capabilities.",
      ],
    },
    {
      id: "orchestration",
      name: "Orchestration Layer",
      subtitle: "Service Coordination & API Gateway",
      status: "Partially Built",
      icon: Activity,
      description:
        "Coordinates traffic between front-end, platforms, AI services, and data services.",
      bullets: [
        "API gateway & routing (Express routes, auth hooks)",
        "Planned: workflow engine and event bus for complex flows",
        "Central place for enforcing policies and cross-cutting rules",
      ],
      details: [
        "Call out that today orchestration is lightweight (Express routing) but the design anticipates a full workflow and event bus.",
        "This is where things like risk‑based routing, human‑in‑loop steps, and escalations will live.",
      ],
    },
    {
      id: "platform",
      name: "Platform Layer",
      subtitle: "Reusable Platforms (SOP Navigator)",
      status: "Built",
      icon: Layers,
      description:
        "Reusable platforms that expose generic capabilities (SOP reasoning, viewers, components) to any solution.",
      bullets: [
        "SOP Navigator: SOP-native platform used by Cogniclaim & TP Resolve",
        "Shared components: ReasoningCard, SOPViewer, UnifiedAIConsole",
        "Adapter pattern keeps platforms decoupled from solution specifics",
      ],
      details: [
        "Use this to reinforce that SOP Navigator is a first platform offering – more can be added like Field Service, Collections, etc.",
        "Emphasize that platform components and services can be reused by any new solution without re‑implementing AI logic.",
      ],
    },
    {
      id: "agentic",
      name: "Agentic Management Layer",
      subtitle: "AI Agent Orchestration",
      status: "Partially Built",
      icon: Brain,
      description:
        "Coordinates the lifecycle of AI agents and multi-step reasoning flows.",
      bullets: [
        "Implements multi-agent chains (Analysis → SOP Match → Risk → Recommendation)",
        "Tracks agent responsibilities and hand-offs",
        "Planned: full agent registry and monitoring",
      ],
      details: [
        "Describe this as the \"air traffic control\" for AI agents – which agent does what, in what order, and how they pass context.",
        "Future‑state: centralized registry and monitoring of all agents Teleperformance runs across clients.",
      ],
    },
    {
      id: "ai",
      name: "AI Services Layer",
      subtitle: "Reasoning, RAG & Streaming",
      status: "Built",
      icon: Brain,
      description:
        "Core AI capabilities that power reasoning, SOP matching, and conversational assistance.",
      bullets: [
        "GPT-4 / GPT-4o-mini via LangChain (frontend) and Node (backend)",
        "Multi-agent reasoning engine with confidence scoring",
        "RAG against SOP data + Server-Sent Events for live streaming",
      ],
      details: [
        "This is your AI \"engine room\" – GPT‑4/4o‑mini plus LangChain orchestrating multi‑step reasoning.",
        "Tie this back to explainability: confidence scores, step‑by‑step traces, and SOP references are all produced here.",
      ],
    },
    {
      id: "backend",
      name: "Backend Services Layer",
      subtitle: "APIs & Request Processing",
      status: "Built",
      icon: Server,
      description:
        "Node/Express backend that exposes AI and data APIs, including streaming endpoints.",
      bullets: [
        "REST APIs: /api/v1/ai/analyze, /api/v1/ai/chat, /api/v1/health",
        "Server-Sent Events for streaming reasoning to the UI",
        "Demo-mode aware routing and configuration",
      ],
      details: [
        "Tell leaders this is where we would plug into client systems (claim platforms, CRMs) without changing the AI stack.",
        "Streaming via SSE is what makes the AI feel \"alive\" during the demo – you can point to that here.",
      ],
    },
    {
      id: "data",
      name: "Data & Infrastructure Layer",
      subtitle: "SOPs, Solution Data, Cloud",
      status: "Partially Built",
      icon: Database,
      description:
        "Data stores and cloud footprint for SOPs, solution data, configuration, and eventual external integrations.",
      bullets: [
        "SOP repositories for Cogniclaim & TP Resolve (SCENARIO_SOPS, SOP_INDEX, etc.)",
        "Claims/cases data with realistic line items and scenarios",
        "Designed for multi-cloud deployment (Azure, GCP, AWS) via containers",
      ],
      details: [
        "Emphasize that SOP data and solution data are already modeled for healthcare; new industries plug in their own SOP sets.",
        "Cloud story: architecture is ready for multi‑cloud, containers, and data‑lake integrations when clients demand it.",
      ],
    },
  ];

  const roiMetrics = [
    {
      metric: "70%",
      label: "Faster Time to Market",
      icon: Clock,
      details: [
        "Platform-first approach reuses AI & SOP capabilities",
        "Pre-built Reasoning, Viewer, and Store surfaces",
        "New solutions inherit platform behavior instead of starting from zero",
      ],
    },
    {
      metric: "60%",
      label: "Cost Reduction",
      icon: DollarSign,
      details: [
        "Shared infra and components across multiple solutions",
        "Lower maintenance via one platform, many solutions",
        "Reduced vendor/tool sprawl in AI & decisioning stack",
      ],
    },
    {
      metric: "2+",
      label: "Solutions per Platform",
      icon: TrendingUp,
      details: [
        "Today: Cogniclaim + TP Resolve on SOP Navigator",
        "Field Service / other verticals can be added quickly",
        "Clear blueprint for reusing agentic + SOP stack",
      ],
    },
    {
      metric: "100%",
      label: "AI-Powered",
      icon: Brain,
      details: [
        "Every solution instrumented with AI Watchtower",
        "Multi-agent reasoning on every claim/case line item",
        "Explainable recommendations tied back to SOPs",
      ],
    },
  ];

  const flowSteps = [
    { id: "user", label: "User Input" },
    { id: "fab-store", label: "FAB Store" },
    { id: "presentation", label: "Solution UI" },
    { id: "orchestration", label: "Orchestration" },
    { id: "platform", label: "Platform Services" },
    { id: "agentic", label: "Agentic Management" },
    { id: "ai", label: "AI Reasoning" },
    { id: "backend", label: "Backend Services" },
    { id: "data", label: "Data & Infrastructure" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F8FF]">
      {/* Background to match FAB Store */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(155,138,255,0.18),transparent_55%),radial-gradient(circle_at_75%_15%,rgba(118,196,255,0.16),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(255,208,233,0.2),transparent_50%)] pointer-events-none" />

      <div className="relative flex flex-col min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-200/70 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-gray-400">
                  TP.ai
                </p>
                <h1 className="text-[1.4rem] md:text-[1.7rem] font-semibold text-gray-900 flex items-center gap-2 leading-tight">
                  <Layers className="w-5 h-5 text-[#612D91]" />
                  FAB Store Enterprise Architecture
                </h1>
                <p className="text-xs md:text-sm text-gray-600 font-medium">
                  Teleperformance AI Platform · Board & CXO-ready overview
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("architecture")}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-[0.85rem] font-semibold transition-all ${
                  viewMode === "architecture"
                    ? "bg-[#612D91] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                Architecture
              </button>
              <button
                onClick={() => setViewMode("roi")}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-[0.85rem] font-semibold transition-all ${
                  viewMode === "roi"
                    ? "bg-[#612D91] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                ROI & Value
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10 flex-1">
          <AnimatePresence mode="wait">
            {viewMode === "architecture" && (
              <motion.div
                key="architecture"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-4 md:space-y-5"
              >
                <div className="grid gap-4 md:gap-5 md:grid-cols-12 items-start">
                  {/* Left: bands */}
                  <div className="md:col-span-9 space-y-4 md:space-y-5">
                    {/* Layer stack grouped into bands */}
                  {/* Band 1: Experience & Solutions */}
                  <section className="rounded-2xl bg-gradient-to-r from-indigo-50 via-white to-purple-50 border border-indigo-100 p-4 md:p-5 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.28em] text-indigo-500">
                          Experience & Solutions
                        </p>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          How clients and leaders experience TP.ai today
                        </h3>
                      </div>
                      <div className="text-[11px] md:text-xs text-gray-600">
                        <span className="font-semibold">Solutions live today:</span>{" "}
                        Cogniclaim · TP Resolve
                      </div>
                    </div>
                    <div className="space-y-3">
                      {layers.slice(0, 3).map((layer, idx) => {
                        const isActive = layer.id === activeLayerId;
                        const visibleBullets = isActive ? layer.bullets : layer.bullets.slice(0, 2);
                        return (
                          <motion.button
                            key={layer.id}
                            type="button"
                            onClick={() => setActiveLayerId(layer.id)}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`relative w-full text-left p-4 md:p-5 rounded-xl border bg-white/95 transition-all ${
                              isActive
                                ? "border-[#612D91]/60 shadow-xl scale-[1.01]"
                                : "border-gray-200/80 hover:border-[#612D91]/40 hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`p-3 rounded-xl bg-gradient-to-r ${
                                  isActive ? "from-[#612D91] to-[#A64AC9]" : "from-gray-500 to-gray-700"
                                } text-white`}
                              >
                                <layer.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center flex-wrap gap-2">
                                  <h2 className="text-sm md:text-base font-semibold text-gray-900">
                                    {layer.name}
                                  </h2>
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                                    {layer.subtitle}
                                  </span>
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                      layer.status === "Built"
                                        ? "bg-green-100 text-green-700"
                                        : layer.status === "Partially Built"
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {layer.status}
                                  </span>
                                  <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-500">
                                    {isActive ? "Collapse details" : "Expand details"}
                                    <ChevronRight
                                      className={`w-3 h-3 transition-transform ${
                                        isActive ? "rotate-90" : ""
                                      }`}
                                    />
                                  </span>
                                </div>
                                <p className="text-xs md:text-[0.85rem] text-gray-700">
                                  {layer.description}
                                </p>
                              </div>
                            </div>
                            <ul className="mt-3 space-y-1.5 text-xs md:text-sm text-gray-700 ml-12">
                              {visibleBullets.map((b) => (
                                <li key={b} className="flex items-start gap-2">
                                  <ChevronRight className="w-3 h-3 mt-1 text-[#612D91]" />
                                  <span>{b}</span>
                                </li>
                              ))}
                              {!isActive && layer.details && (
                                <li className="flex items-start gap-2 text-[11px] text-gray-500">
                                  <span className="ml-4">
                                    …click row to see how to narrate this layer
                                  </span>
                                </li>
                              )}
                            </ul>

                            {isActive && layer.details && (
                              <div className="mt-4 ml-12 p-4 rounded-xl bg-gray-50 border border-gray-200">
                                <p className="text-xs font-semibold text-gray-800 mb-2">
                                  How to talk about this layer in the demo
                                </p>
                                <ul className="space-y-1.5 text-xs md:text-sm text-gray-700">
                                  {layer.details.map((d) => (
                                    <li key={d} className="flex items-start gap-2">
                                      <Info className="w-3.5 h-3.5 mt-0.5 text-[#612D91]" />
                                      <span>{d}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </section>

                  {/* Band 2: Platform & AI Engine */}
                  <section className="rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-violet-50 border border-emerald-100 p-4 md:p-5 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.28em] text-emerald-500">
                          Platform & AI Engine
                        </p>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          Reusable capabilities that power every solution
                        </h3>
                      </div>
                      <div className="text-[11px] md:text-xs text-gray-600">
                        <span className="font-semibold">Current platform:</span>{" "}
                        SOP Navigator (more coming on roadmap)
                      </div>
                    </div>
                    <div className="space-y-3">
                      {layers.slice(3, 7).map((layer, idx) => {
                        const isActive = layer.id === activeLayerId;
                        const visibleBullets = isActive ? layer.bullets : layer.bullets.slice(0, 2);
                        return (
                          <motion.button
                            key={layer.id}
                            type="button"
                            onClick={() => setActiveLayerId(layer.id)}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`relative w-full text-left p-4 md:p-5 rounded-xl border bg-white/95 transition-all ${
                              isActive
                                ? "border-[#0F766E]/60 shadow-xl scale-[1.01]"
                                : "border-gray-200/80 hover:border-[#0F766E]/40 hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`p-3 rounded-xl bg-gradient-to-r ${
                                  isActive ? "from-emerald-600 to-teal-500" : "from-gray-500 to-gray-700"
                                } text-white`}
                              >
                                <layer.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center flex-wrap gap-2">
                                  <h2 className="text-sm md:text-base font-semibold text-gray-900">
                                    {layer.name}
                                  </h2>
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                                    {layer.subtitle}
                                  </span>
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                      layer.status === "Built"
                                        ? "bg-green-100 text-green-700"
                                        : layer.status === "Partially Built"
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {layer.status}
                                  </span>
                                  <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-500">
                                    {isActive ? "Collapse details" : "Expand details"}
                                    <ChevronRight
                                      className={`w-3 h-3 transition-transform ${
                                        isActive ? "rotate-90" : ""
                                      }`}
                                    />
                                  </span>
                                </div>
                                <p className="text-xs md:text-[0.85rem] text-gray-700">
                                  {layer.description}
                                </p>
                              </div>
                            </div>
                            <ul className="mt-3 space-y-1.5 text-xs md:text-sm text-gray-700 ml-12">
                              {visibleBullets.map((b) => (
                                <li key={b} className="flex items-start gap-2">
                                  <ChevronRight className="w-3 h-3 mt-1 text-emerald-700" />
                                  <span>{b}</span>
                                </li>
                              ))}
                              {!isActive && layer.details && (
                                <li className="flex items-start gap-2 text-[11px] text-gray-500">
                                  <span className="ml-4">…click row to see how to narrate this layer</span>
                                </li>
                              )}
                            </ul>

                            {isActive && layer.details && (
                              <div className="mt-4 ml-12 p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                                <p className="text-xs font-semibold text-emerald-900 mb-2">
                                  How to talk about this layer in the demo
                                </p>
                                <ul className="space-y-1.5 text-xs md:text-sm text-emerald-900/90">
                                  {layer.details.map((d) => (
                                    <li key={d} className="flex items-start gap-2">
                                      <Info className="w-3.5 h-3.5 mt-0.5 text-emerald-700" />
                                      <span>{d}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </section>

                  {/* Band 3: Engine, Data & Infrastructure */}
                  <section className="rounded-2xl bg-gradient-to-r from-slate-50 via-white to-slate-100 border border-slate-200 p-4 md:p-5 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                          Engine, Data & Infra
                        </p>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          Where APIs, data, and cloud bring it all together
                        </h3>
                      </div>
                      <div className="text-[11px] md:text-xs text-gray-600">
                        <span className="font-semibold">Today:</span>{" "}
                        Node/Express backend + in‑repo SOP & demo data
                      </div>
                    </div>
                    <div className="space-y-3">
                      {layers.slice(7, 9).map((layer, idx) => {
                        const isActive = layer.id === activeLayerId;
                        const visibleBullets = isActive ? layer.bullets : layer.bullets.slice(0, 2);
                        return (
                          <motion.button
                            key={layer.id}
                            type="button"
                            onClick={() => setActiveLayerId(layer.id)}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`relative w-full text-left p-4 md:p-5 rounded-xl border bg-white/95 transition-all ${
                              isActive
                                ? "border-slate-500/70 shadow-xl scale-[1.01]"
                                : "border-gray-200/80 hover:border-slate-400 hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`p-3 rounded-xl bg-gradient-to-r ${
                                  isActive ? "from-slate-700 to-slate-900" : "from-gray-500 to-gray-700"
                                } text-white`}
                              >
                                <layer.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center flex-wrap gap-2">
                                  <h2 className="text-sm md:text-base font-semibold text-gray-900">
                                    {layer.name}
                                  </h2>
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                                    {layer.subtitle}
                                  </span>
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                      layer.status === "Built"
                                        ? "bg-green-100 text-green-700"
                                        : layer.status === "Partially Built"
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {layer.status}
                                  </span>
                                  <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-500">
                                    {isActive ? "Collapse details" : "Expand details"}
                                    <ChevronRight
                                      className={`w-3 h-3 transition-transform ${
                                        isActive ? "rotate-90" : ""
                                      }`}
                                    />
                                  </span>
                                </div>
                                <p className="text-xs md:text-[0.85rem] text-gray-700">
                                  {layer.description}
                                </p>
                              </div>
                            </div>
                            <ul className="mt-3 space-y-1.5 text-xs md:text-sm text-gray-700 ml-12">
                              {visibleBullets.map((b) => (
                                <li key={b} className="flex items-start gap-2">
                                  <ChevronRight className="w-3 h-3 mt-1 text-slate-700" />
                                  <span>{b}</span>
                                </li>
                              ))}
                              {!isActive && layer.details && (
                                <li className="flex items-start gap-2 text-[11px] text-gray-500">
                                  <span className="ml-4">…click row to see how to narrate this layer</span>
                                </li>
                              )}
                            </ul>

                            {isActive && layer.details && (
                              <div className="mt-4 ml-12 p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="text-xs font-semibold text-slate-900 mb-2">
                                  How to talk about this layer in the demo
                                </p>
                                <ul className="space-y-1.5 text-xs md:text-sm text-slate-900/90">
                                  {layer.details.map((d) => (
                                    <li key={d} className="flex items-start gap-2">
                                      <Info className="w-3.5 h-3.5 mt-0.5 text-slate-700" />
                                      <span>{d}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </section>

                  {/* Cross-cutting concerns */}
                  <div className="bg-white/95 rounded-2xl shadow-lg p-5 md:p-6 border border-white/60">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-gray-700" />
                      Cross-Cutting Concerns
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] md:text-xs">
                      <div className="p-3 rounded-xl border border-gray-200 bg-white">
                        <div className="flex items-center gap-2 mb-1">
                          <Lock className="w-4 h-4 text-red-600" />
                          <span className="font-semibold text-gray-900">
                            Security
                          </span>
                        </div>
                        <ul className="space-y-1 text-gray-700">
                          <li>AuthContext-based sign-in & session</li>
                          <li>CORS and API security on backend routes</li>
                        </ul>
                      </div>
                      <div className="p-3 rounded-xl border border-gray-200 bg-white">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-gray-900">
                            Observability
                          </span>
                        </div>
                        <ul className="space-y-1 text-gray-700">
                          <li>AI agent metrics & reasoning traces</li>
                          <li>Error handling and streaming telemetry</li>
                        </ul>
                      </div>
                      <div className="p-3 rounded-xl border border-gray-200 bg-white">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-gray-900">
                            Compliance
                          </span>
                        </div>
                        <ul className="space-y-1 text-gray-700">
                          <li>SOP-linked reasoning and decisions</li>
                          <li>Traceability from recommendation → SOP → step</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                  {/* Right: compact flow & legend */}
                  <div className="md:col-span-3 space-y-3 md:space-y-4">
                    {/* End-to-end flow summary as a single horizontal strip */}
                    <div className="bg-gradient-to-b from-blue-50 via-cyan-50 to-blue-50 rounded-2xl border border-blue-200 px-3 py-3 md:px-4 md:py-3">
                      <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Network className="w-5 h-5 text-blue-600" />
                        End-to-End Flow
                      </h3>
                      <div className="flex items-center gap-1 md:gap-1.5 overflow-x-auto no-scrollbar text-[10px] md:text-xs font-semibold text-gray-800 py-0.5">
                        {flowSteps.map((step, idx) => {
                          const isLayerStep = layers.some((l) => l.id === step.id);
                          const isActive = isLayerStep && activeLayerId === step.id;
                          const baseClasses =
                            "px-2.5 py-1 rounded-lg border cursor-pointer transition-all whitespace-nowrap";
                          const colorClasses = isActive
                            ? "bg-[#612D91] text-white border-[#612D91]"
                            : step.id === "user"
                            ? "bg-white border-blue-200"
                            : step.id === "fab-store"
                            ? "bg-indigo-100 border-indigo-300"
                            : step.id === "orchestration"
                            ? "bg-amber-100 border-amber-300"
                            : step.id === "agentic"
                            ? "bg-cyan-100 border-cyan-300"
                            : step.id === "ai"
                            ? "bg-emerald-100 border-emerald-300"
                            : step.id === "data"
                            ? "bg-gray-100 border-gray-300"
                            : "bg-white border-blue-200";
                          return (
                            <div key={step.id} className="flex items-center gap-1 flex-shrink-0">
                              <button
                                type="button"
                                className={`${baseClasses} ${colorClasses}`}
                                onClick={() => {
                                  if (isLayerStep) {
                                    setActiveLayerId(step.id);
                                  }
                                }}
                              >
                                {step.label}
                              </button>
                              {idx < flowSteps.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-blue-500 flex-shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Small legend for build status */}
                    <div className="bg-white/95 rounded-2xl shadow-md p-3 md:p-4 border border-gray-200 text-[11px] md:text-xs text-gray-700 space-y-2">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
                        <Cpu className="w-4 h-4 text-gray-700" />
                        Build Status Legend
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                          ✓ Built
                        </span>
                        <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">
                          ⚠ Partially Built
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold">
                          📋 Roadmap
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600">
                        Use this to set expectations with leaders on what ships today vs. what’s
                        intentionally designed for expansion.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {viewMode === "roi" && (
              <motion.div
                key="roi"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    Platform ROI & Value
                  </h2>
                  <p className="text-base md:text-lg text-gray-600">
                    How FAB Store + SOP Navigator translate into measurable business outcomes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {roiMetrics.map((m) => (
                    <div
                      key={m.label}
                      className="bg-gradient-to-br from-[#612D91] to-[#A64AC9] rounded-2xl text-white p-5 shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <m.icon className="w-7 h-7 opacity-90" />
                      </div>
                      <div className="text-4xl font-bold mb-1">{m.metric}</div>
                      <div className="text-sm font-semibold mb-3">{m.label}</div>
                      <ul className="space-y-2 text-xs">
                        {m.details.map((d) => (
                          <li key={d} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 mt-0.5" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-200">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Why this architecture matters for Teleperformance
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
                    <div>
                      <h4 className="font-semibold mb-2">Strategic</h4>
                      <p>
                        Create a reusable AI and SOP platform that can serve multiple verticals
                        (healthcare today, finance / insurance tomorrow) without rewriting the core.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Operational</h4>
                      <p>
                        Standardize how AI reasoning, SOPs, and decisioning show up across
                        clients—making operations easier to run, monitor, and audit.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Commercial</h4>
                      <p>
                        Shorten sales and delivery cycles by showing Cogniclaim / TP Resolve as
                        proof points on top of a platform that can be reused for new deals.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}



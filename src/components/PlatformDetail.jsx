import React, { useState } from "react";
import { ArrowLeft, FileText, Code, BookOpen, CheckCircle2, ArrowRight, Layers, Database, Brain, Zap, GitBranch, TrendingUp, Users, Globe, Printer, Droplet } from "lucide-react";
import { fabApps } from "../data/fabApps";
import { enrichPlatformWithMetrics } from "../data/fabPlatforms";
import { motion } from "framer-motion";
import AgenticSupportDemo from "./AgenticSupportDemo";

export default function PlatformDetail({ platform, onBack, onLaunch, readOnly, onRequestLogin }) {
  // Enrich platform with metrics
  const enrichedPlatform = enrichPlatformWithMetrics(platform);
  const metrics = enrichedPlatform.metrics || { solutionCount: 0, industries: [], liveSolutions: 0 };
  
  // Find solutions built on this platform
  const solutions = fabApps.filter((app) => app.platformId === platform.id);
  
  // For Agentic Support, show workflows as solutions
  const isAgenticSupport = platform.id === "agentic-support";
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  
  const agenticWorkflows = isAgenticSupport ? [
    {
      id: "printer_offline",
      name: "Printer Offline Workflow",
      tagline: "Self-healing workflow for offline printer issues",
      description: "Automatically diagnose network, spooler and heartbeat issues. Attempts self-healing actions and escalates if needed.",
      icon: Printer,
      status: "Live",
    },
    {
      id: "ink_error",
      name: "Ink Cartridge Error Workflow",
      tagline: "Self-healing workflow for ink cartridge recognition",
      description: "Validates cartridge authenticity, firmware compatibility and entitlement. Auto-ships replacement if eligible.",
      icon: Droplet,
      status: "Live",
    },
  ] : [];

  return (
    <div className="px-4 md:px-10 pb-16 space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg border border-stroke01 hover:bg-bg02 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-text02" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-text01">{platform.name}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${platform.statusColor || "bg-bg03 text-text01"}`}>
              {platform.status}
            </span>
          </div>
          <p className="text-lg text-text02 mt-1">{platform.tagline}</p>
        </div>
      </div>

      {/* Platform Metrics Section */}
      <section className="rounded-[32px] bg-gradient-to-br from-pinkTP/10 to-pinkTP/10 border border-pinkTP/20 shadow-[0_35px_85px_rgba(15,10,45,0.12)] p-8 space-y-6 backdrop-blur">
        <div>
          <h2 className="text-2xl font-semibold text-text01 mb-4">Platform Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white/80 border border-pinkTP/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-pinkTP" />
                <span className="text-sm font-semibold text-text02">Solutions Built</span>
              </div>
              <p className="text-3xl font-bold text-text01">{metrics.solutionCount}</p>
              <p className="text-xs text-text03 mt-1">{metrics.liveSolutions} live in production</p>
            </div>
            <div className="rounded-xl bg-white/80 border border-pinkTP/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-pinkTP" />
                <span className="text-sm font-semibold text-text02">Industries Served</span>
              </div>
              <p className="text-3xl font-bold text-text01">{metrics.industriesCount || 1}</p>
              <p className="text-xs text-text03 mt-1">
                {metrics.industries && metrics.industries.length > 0 
                  ? metrics.industries.join(", ")
                  : platform.industry}
              </p>
            </div>
            <div className="rounded-xl bg-white/80 border border-pinkTP/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-pinkTP" />
                <span className="text-sm font-semibold text-text02">Status</span>
              </div>
              <p className="text-3xl font-bold text-text01">{platform.status}</p>
              <p className="text-xs text-text03 mt-1">Platform availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="rounded-[32px] bg-white/95 border border-white/40 shadow-[0_35px_85px_rgba(15,10,45,0.12)] p-8 space-y-6 backdrop-blur">
        <div>
          <h2 className="text-2xl font-semibold text-text01 mb-3">Overview</h2>
          <p className="text-text01 leading-relaxed">{platform.documentation?.overview || platform.description}</p>
        </div>

        {platform.documentation?.features && (
          <div>
            <h3 className="text-xl font-semibold text-text01 mb-3">Key Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {platform.documentation.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-pinkTP mt-0.5 shrink-0" />
                  <span className="text-text01">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Existing Solutions Section */}
      {((isAgenticSupport && agenticWorkflows.length > 0) || solutions.length > 0) && (
        <section className="rounded-[32px] bg-white/95 border border-white/40 shadow-[0_35px_85px_rgba(15,10,45,0.12)] p-8 space-y-6 backdrop-blur">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-2xl font-semibold text-text01">
                  {isAgenticSupport ? "Workflows Available" : `Solutions Built on ${platform.name}`}
                </h2>
                <p className="text-text02 mt-1">
                  {isAgenticSupport 
                    ? `${agenticWorkflows.length} self-healing workflows leveraging ${platform.name} capabilities`
                    : `${solutions.length} ${solutions.length === 1 ? 'solution' : 'solutions'} leveraging ${platform.name} capabilities`
                  }
                </p>
              </div>
              <div className="px-4 py-2 rounded-full bg-pinkTP/10 text-pinkTP text-sm font-semibold">
                {isAgenticSupport ? agenticWorkflows.length : metrics.solutionCount} Total
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {isAgenticSupport ? (
              agenticWorkflows.map((workflow) => {
                const Icon = workflow.icon;
                return (
                  <div 
                    key={workflow.id} 
                    className="relative rounded-[28px] border border-white/40 bg-white/95 shadow-[0_20px_50px_rgba(18,12,64,0.15)] flex flex-col overflow-hidden cursor-pointer hover:shadow-[0_25px_60px_rgba(18,12,64,0.2)] transition-shadow"
                    onClick={() => setSelectedWorkflow(workflow.id)}
                  >
                    <div className="h-1.5 w-full bg-gradient-to-r from-pinkTP to-pinkTP" />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-pinkTP/10 text-pinkTP text-[10px] font-semibold z-10">
                      {workflow.status}
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pinkTP to-pinkTP flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-text01">{workflow.name}</h3>
                          <p className="text-sm text-text02 font-medium">{workflow.tagline}</p>
                        </div>
                      </div>
                      <p className="text-sm text-text02 flex-1">{workflow.description}</p>
                      <button
                        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pinkTP to-pinkTP text-white font-semibold text-sm hover:shadow-lg transition-all"
                      >
                        Try Workflow
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              solutions.map((app) => (
                <div key={app.id} className="relative rounded-[28px] border border-white/40 bg-white/95 shadow-[0_20px_50px_rgba(18,12,64,0.15)] flex flex-col overflow-hidden">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${app.accent}`} />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-pinkTP/10 text-pinkTP text-[10px] font-semibold z-10">
                    Built on {platform.name}
                  </div>
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-center flex-wrap gap-2 text-xs uppercase tracking-wide text-text03">
                      <span className={app.categoryColor}>{app.category}</span>
                      <span className={`px-2 py-0.5 rounded-full ${app.statusColor || "bg-bg03 text-text01"}`}>{app.status}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-text01">{app.name}</h3>
                      <p className="text-sm text-text02 font-medium">{app.tagline}</p>
                    </div>
                    <p className="text-sm text-text02 flex-1">{app.description}</p>
                    <div className="flex flex-wrap gap-3 text-[11px] text-text02">
                      <div className="rounded-2xl border border-stroke01/80 px-3 py-1.5">
                        <p className="uppercase tracking-wide text-text03 font-semibold">Industry</p>
                        <p className="font-semibold text-text01">{app.industry}</p>
                      </div>
                      <div className="rounded-2xl border border-stroke01/80 px-3 py-1.5">
                        <p className="uppercase tracking-wide text-text03 font-semibold">Vertical</p>
                        <p className="font-semibold text-text01">{app.vertical ?? app.category}</p>
                      </div>
                    </div>
                    {!readOnly && (
                      <button
                        onClick={() => onLaunch?.(app.launchKey || app.id)}
                        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pinkTP to-pinkTP text-white font-semibold text-sm hover:shadow-lg transition-all"
                      >
                        {app.ctaLabel || "Launch"}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    {readOnly && (
                      <button
                        onClick={onRequestLogin}
                        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-bg03 text-text01 font-semibold text-sm hover:bg-stroke01 transition-all"
                      >
                        Sign in to launch
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* Agentic Support Demo Section */}
      {isAgenticSupport && selectedWorkflow && (
        <section className="rounded-[32px] bg-white/95 border border-white/40 shadow-[0_35px_85px_rgba(15,10,45,0.12)] p-8 space-y-6 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-text01">Workflow Demo</h2>
              <p className="text-text02 mt-1">
                Interactive demo for {agenticWorkflows.find(w => w.id === selectedWorkflow)?.name}
              </p>
            </div>
            <button
              onClick={() => setSelectedWorkflow(null)}
              className="px-4 py-2 rounded-lg border border-stroke01 hover:bg-bg02 transition-colors text-sm font-medium text-text01"
            >
              Close Demo
            </button>
          </div>
          <AgenticSupportDemo 
            onBack={() => setSelectedWorkflow(null)} 
            embedded={true}
            initialWorkflow={selectedWorkflow}
          />
        </section>
      )}

      {/* Architecture Section */}
      {platform.documentation?.architecture && (
        <section className="rounded-[32px] bg-white/95 border border-white/40 shadow-[0_35px_85px_rgba(15,10,45,0.12)] p-8 space-y-6 backdrop-blur">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-6 h-6 text-pinkTP" />
            <h2 className="text-2xl font-semibold text-text01">{platform.documentation.architecture.title}</h2>
          </div>
          <p className="text-text01 leading-relaxed">{platform.documentation.architecture.description}</p>
          
          {/* Architecture Diagram */}
          {platform.documentation.architecture.diagram && (
            <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-bg02 to-bg03 border border-stroke01">
              <h3 className="text-lg font-semibold text-text01 mb-4">{platform.documentation.architecture.diagram.title}</h3>
              <div className="space-y-4">
                {platform.documentation.architecture.diagram.layers.map((layer, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-lg border-2 border-pinkTP/30 bg-white"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-pinkTP text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-text01 mb-1">{layer.name}</h4>
                        <p className="text-sm text-text02 mb-2">{layer.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {layer.components.map((comp, compIdx) => (
                            <span key={compIdx} className="px-2 py-1 rounded-md bg-pinkTP/10 text-pinkTP text-xs font-medium">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Component Details */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-text01 mb-4">Core Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platform.documentation.architecture.components?.map((component, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-5 rounded-xl border border-stroke01 bg-bg02 hover:border-pinkTP/50 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {idx === 0 && <Database className="w-5 h-5 text-pinkTP mt-0.5 shrink-0" />}
                    {idx === 1 && <Brain className="w-5 h-5 text-pinkTP mt-0.5 shrink-0" />}
                    {idx === 2 && <GitBranch className="w-5 h-5 text-pinkTP mt-0.5 shrink-0" />}
                    {idx === 3 && <Code className="w-5 h-5 text-pinkTP mt-0.5 shrink-0" />}
                    <h4 className="font-semibold text-text01">{component.name}</h4>
                  </div>
                  <p className="text-sm text-text02 mb-3">{component.description}</p>
                  {component.code && (
                    <div className="mt-3 p-3 rounded-lg bg-text01 text-bg03 font-mono text-xs overflow-x-auto">
                      <pre className="whitespace-pre-wrap">{component.code}</pre>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Data Flow */}
          {platform.documentation.architecture.dataFlow && (
            <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-pinkTP/5 to-pinkTP/5 border border-pinkTP/20">
              <h3 className="text-lg font-semibold text-text01 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-pinkTP" />
                {platform.documentation.architecture.dataFlow.title}
              </h3>
              <div className="space-y-3">
                {platform.documentation.architecture.dataFlow.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-white border-l-4 border-pinkTP">
                    <div className="w-8 h-8 rounded-full bg-pinkTP text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-text01 mb-1">{step.title}</h4>
                      <p className="text-sm text-text02">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Technology Stack */}
          {platform.documentation.architecture.technology && (
            <div className="mt-6 p-6 rounded-xl border border-stroke01 bg-white">
              <h3 className="text-lg font-semibold text-text01 mb-4">{platform.documentation.architecture.technology.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {platform.documentation.architecture.technology.frontend && (
                  <div>
                    <p className="font-semibold text-text01 mb-2">Frontend</p>
                    <ul className="text-sm text-text02 space-y-1">
                      {platform.documentation.architecture.technology.frontend.map((tech, idx) => (
                        <li key={idx}>• {tech}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {platform.documentation.architecture.technology.backend && (
                  <div>
                    <p className="font-semibold text-text01 mb-2">Backend</p>
                    <ul className="text-sm text-text02 space-y-1">
                      {platform.documentation.architecture.technology.backend.map((tech, idx) => (
                        <li key={idx}>• {tech}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {platform.documentation.architecture.technology.ai && (
                  <div>
                    <p className="font-semibold text-text01 mb-2">AI & ML</p>
                    <ul className="text-sm text-text02 space-y-1">
                      {platform.documentation.architecture.technology.ai.map((tech, idx) => (
                        <li key={idx}>• {tech}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {platform.documentation.architecture.technology.patterns && (
                  <div>
                    <p className="font-semibold text-text01 mb-2">Architecture Patterns</p>
                    <ul className="text-sm text-text02 space-y-1">
                      {platform.documentation.architecture.technology.patterns.map((pattern, idx) => (
                        <li key={idx}>• {pattern}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* How to Build Section */}
      {platform.documentation?.integration && (
        <section className="rounded-[32px] bg-white/95 border border-white/40 shadow-[0_35px_85px_rgba(15,10,45,0.12)] p-8 space-y-6 backdrop-blur">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-pinkTP" />
            <h2 className="text-2xl font-semibold text-text01">{platform.documentation.integration.title}</h2>
          </div>
          <div className="space-y-6">
            {platform.documentation.integration.steps?.map((step, idx) => (
              <div key={idx} className="border-l-4 border-pinkTP pl-6 py-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-pinkTP text-white flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-text01">{step.title}</h3>
                </div>
                <p className="text-text01 mb-3">{step.description}</p>
                {step.code && (
                  <div className="mt-3 p-4 rounded-lg bg-text01 text-bg03 font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{step.code}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Best Practices Section */}
      {platform.documentation?.bestPractices && (
        <section className="rounded-[32px] bg-white/95 border border-white/40 shadow-[0_35px_85px_rgba(15,10,45,0.12)] p-8 space-y-6 backdrop-blur">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-pinkTP" />
            <h2 className="text-2xl font-semibold text-text01">{platform.documentation.bestPractices.title}</h2>
          </div>
          <ul className="space-y-3">
            {platform.documentation.bestPractices.items?.map((practice, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-pinkTP mt-0.5 shrink-0" />
                <span className="text-text01">{practice}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}


import { useState } from "react";
import { 
  Server, 
  Shield, 
  Globe, 
  Zap, 
  Settings, 
  Database,
  Key,
  Bell,
  Users,
  Activity
} from "lucide-react";
import CCASConfigPanel from "./CCASConfigPanel";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("ccas");

  const tabs = [
    { id: "ccas", label: "CCAS Configuration", icon: Server },
    { id: "integrations", label: "Integrations", icon: Zap },
    { id: "security", label: "Security & Access", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-bg02 via-pinkTP/10/20 to-neutral01/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pinkTP to-pinkTP text-white px-6 py-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Configuration</h1>
            <p className="text-sm text-pinkTP/20">Manage system settings and integrations</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-stroke01 px-6">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-pinkTP text-pinkTP bg-pinkTP/10/50"
                    : "border-transparent text-text02 hover:text-text01 hover:bg-bg02"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === "ccas" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text01 mb-2">Contact Center Configuration</h2>
              <p className="text-sm text-text02">
                Configure your CCAS provider settings, webhooks, and channel integrations for voice, SMS, and chat support.
              </p>
            </div>
            <div className="h-auto">
              <CCASConfigPanel />
            </div>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text01 mb-2">System Integrations</h2>
              <p className="text-sm text-text02">
                Connect with external systems for ticketing, CRM, knowledge bases, and more.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {/* Ticketing Systems */}
              <div className="bg-white border-2 border-stroke01 rounded-xl p-5 hover:border-purple-300 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral01 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-neutral02" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text01">Ticketing Systems</h3>
                      <p className="text-xs text-text03">ITSM & CRM Platforms</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-success01 text-success02 rounded-full text-xs font-bold">
                    Active
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm bg-bg02 rounded-lg px-3 py-2">
                    <span className="text-text01">ServiceNow</span>
                    <span className="text-success03 font-semibold">Connected</span>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-bg02 rounded-lg px-3 py-2">
                    <span className="text-text01">Jira</span>
                    <span className="text-success03 font-semibold">Connected</span>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-bg02 rounded-lg px-3 py-2">
                    <span className="text-text01">Zendesk</span>
                    <span className="text-text03 font-semibold">Available</span>
                  </div>
                </div>
              </div>

              {/* Knowledge Base */}
              <div className="bg-white border-2 border-stroke01 rounded-xl p-5 hover:border-purple-300 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pinkTP/20 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-pinkTP" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text01">Knowledge Base</h3>
                      <p className="text-xs text-text03">Vector DB & RAG</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-success01 text-success02 rounded-full text-xs font-bold">
                    Active
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm bg-bg02 rounded-lg px-3 py-2">
                    <span className="text-text01">Vector Database</span>
                    <span className="text-success03 font-semibold">Pinecone</span>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-bg02 rounded-lg px-3 py-2">
                    <span className="text-text01">Embeddings</span>
                    <span className="text-success03 font-semibold">OpenAI Ada-002</span>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-bg02 rounded-lg px-3 py-2">
                    <span className="text-text01">Documents</span>
                    <span className="text-pinkTP font-semibold">1,247 indexed</span>
                  </div>
                </div>
              </div>

              {/* AI Models */}
              <div className="bg-white border-2 border-stroke01 rounded-xl p-5 hover:border-purple-300 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral01 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text01">AI Models</h3>
                      <p className="text-xs text-text03">LLM & Orchestration</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-success01 text-success02 rounded-full text-xs font-bold">
                    Active
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm bg-bg02 rounded-lg px-3 py-2">
                    <span className="text-text01">Primary LLM</span>
                    <span className="text-success03 font-semibold">GPT-4</span>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-bg02 rounded-lg px-3 py-2">
                    <span className="text-text01">Orchestration</span>
                    <span className="text-success03 font-semibold">LangChain</span>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-bg02 rounded-lg px-3 py-2">
                    <span className="text-text01">Intent Detection</span>
                    <span className="text-success03 font-semibold">Custom Model</span>
                  </div>
                </div>
              </div>

              {/* Device Telemetry */}
              <div className="bg-white border-2 border-stroke01 rounded-xl p-5 hover:border-purple-300 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-alert01 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-alert02" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text01">Device Telemetry</h3>
                      <p className="text-xs text-text03">IoT & Monitoring</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-success01 text-success02 rounded-full text-xs font-bold">
                    Active
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm bg-bg02 rounded-lg px-3 py-2">
                    <span className="text-text01">Connected Devices</span>
                    <span className="text-success03 font-semibold">2,341</span>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-bg02 rounded-lg px-3 py-2">
                    <span className="text-text01">Data Sync</span>
                    <span className="text-success03 font-semibold">Real-time</span>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-bg02 rounded-lg px-3 py-2">
                    <span className="text-text01">API Endpoint</span>
                    <span className="text-pinkTP font-semibold">Configured</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text01 mb-2">Security & Access Control</h2>
              <p className="text-sm text-text02">
                Manage authentication, authorization, API keys, and security policies.
              </p>
            </div>
            
            <div className="space-y-4">
              {/* API Keys */}
              <div className="bg-white border-2 border-stroke01 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-5 h-5 text-pinkTP" />
                  <h3 className="font-bold text-text01">API Keys</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-bg02 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-text01">Production API Key</span>
                      <span className="px-2 py-1 bg-success01 text-success02 rounded text-xs font-bold">Active</span>
                    </div>
                    <div className="font-mono text-xs text-text02 bg-white border border-stroke01 rounded px-3 py-2">
                      sk_live_••••••••••••••••••••••••7890
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-text03">
                      <span>Created: Dec 15, 2025</span>
                      <span>Last used: 2 hours ago</span>
                    </div>
                  </div>
                  
                  <div className="bg-bg02 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-text01">Development API Key</span>
                      <span className="px-2 py-1 bg-neutral01 text-neutral02 rounded text-xs font-bold">Active</span>
                    </div>
                    <div className="font-mono text-xs text-text02 bg-white border border-stroke01 rounded px-3 py-2">
                      sk_test_••••••••••••••••••••••••4567
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-text03">
                      <span>Created: Dec 10, 2025</span>
                      <span>Last used: 15 minutes ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Access */}
              <div className="bg-white border-2 border-stroke01 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-pinkTP" />
                  <h3 className="font-bold text-text01">User Access</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Admin Users", count: 3, color: "red" },
                    { name: "Support Agents", count: 12, color: "blue" },
                    { name: "Read-Only", count: 8, color: "gray" },
                  ].map((role) => (
                    <div key={role.name} className="flex items-center justify-between bg-bg02 rounded-lg px-4 py-3">
                      <span className="text-sm font-medium text-text01">{role.name}</span>
                      <span className={`px-3 py-1 bg-${role.color}-100 text-${role.color}-700 rounded-full text-sm font-bold`}>
                        {role.count} users
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text01 mb-2">Notification Settings</h2>
              <p className="text-sm text-text02">
                Configure alerts, webhooks, and notification channels for system events.
              </p>
            </div>
            
            <div className="bg-white border-2 border-stroke01 rounded-xl p-5">
              <div className="space-y-4">
                {[
                  { label: "Workflow Escalations", desc: "Notify when workflows require human intervention", enabled: true },
                  { label: "System Errors", desc: "Alert on critical system failures", enabled: true },
                  { label: "Daily Summaries", desc: "Receive daily performance reports", enabled: true },
                  { label: "Low Confidence Predictions", desc: "Alert when AI confidence is below threshold", enabled: false },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between p-4 bg-bg02 rounded-lg">
                    <div>
                      <p className="font-semibold text-text01">{setting.label}</p>
                      <p className="text-sm text-text02">{setting.desc}</p>
                    </div>
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        setting.enabled ? "bg-pinkTP" : "bg-stroke01"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          setting.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


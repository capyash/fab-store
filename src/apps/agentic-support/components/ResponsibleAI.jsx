/**
 * Responsible AI - Ethics, Governance, and Compliance
 * Author: Vinod Kumar V (VKV)
 */

import { motion } from "framer-motion";
import { Shield, Store, CheckCircle2, AlertTriangle, Eye, Lock, Users, FileText, Brain, Gavel, TrendingUp } from "lucide-react";

export default function ResponsibleAI({ onNavigate }) {
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30 min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-[#780096] p-8 shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Responsible AI
                  </h1>
                  <p className="text-purple-100 text-sm sm:text-base">
                    Ethics, governance, and compliance framework for AI operations
                  </p>
                </div>
              </div>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate("store")}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-white/20 hover:bg-white/30 rounded-lg border border-white/30 backdrop-blur-sm transition-all"
                title="Back to FAB Store"
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Store</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-white border border-gray-200 shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Privacy & Security</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Comprehensive data protection, access controls, and security measures to safeguard sensitive information.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>End-to-end encryption for all data</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Role-based access control (RBAC)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Regular security audits and compliance checks</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>GDPR and data privacy compliance</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-white border border-gray-200 shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-green-100">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Fairness & Bias</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Ensuring equitable AI decision-making through bias detection, mitigation, and continuous monitoring.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Automated bias detection algorithms</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Diverse training data validation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Fairness metrics and reporting</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Regular model retraining and validation</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-white border border-gray-200 shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Transparency</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Explainable AI with comprehensive audit trails, decision logging, and human-understandable reasoning.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Complete decision audit trails</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Human-readable reasoning explanations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Model versioning and change tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Public documentation and disclosures</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Additional Framework Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl bg-white border border-gray-200 shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-amber-100">
              <Gavel className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Governance & Compliance</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Structured governance framework ensuring regulatory compliance and ethical standards.
          </p>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="font-semibold text-sm text-gray-900 mb-1">Regulatory Compliance</div>
              <div className="text-xs text-gray-600">EU AI Act, GDPR, CCPA, and industry-specific regulations</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="font-semibold text-sm text-gray-900 mb-1">Ethics Review Board</div>
              <div className="text-xs text-gray-600">Regular reviews and approvals for AI model deployments</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="font-semibold text-sm text-gray-900 mb-1">Risk Assessment</div>
              <div className="text-xs text-gray-600">Continuous monitoring and risk mitigation strategies</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl bg-white border border-gray-200 shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-indigo-100">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Human Oversight</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Human-in-the-loop controls ensuring AI decisions are monitored, reviewed, and can be overridden.
          </p>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="font-semibold text-sm text-gray-900 mb-1">Escalation Protocols</div>
              <div className="text-xs text-gray-600">Automatic escalation for high-risk decisions</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="font-semibold text-sm text-gray-900 mb-1">Human Review Queue</div>
              <div className="text-xs text-gray-600">Dedicated workflow for human expert review</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="font-semibold text-sm text-gray-900 mb-1">Override Capabilities</div>
              <div className="text-xs text-gray-600">Authorized personnel can override AI decisions</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Metrics & Status Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-3xl bg-white border border-gray-200 shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#780096]/10">
              <TrendingUp className="w-5 h-5 text-[#780096]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Compliance Status</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700">All Systems Compliant</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-700 mb-1">100%</div>
            <div className="text-xs text-gray-600">Data Encryption</div>
          </div>
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-700 mb-1">98.5%</div>
            <div className="text-xs text-gray-600">Bias Detection Coverage</div>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center">
            <div className="text-2xl font-bold text-purple-700 mb-1">100%</div>
            <div className="text-xs text-gray-600">Audit Trail Coverage</div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <div className="text-2xl font-bold text-amber-700 mb-1">24/7</div>
            <div className="text-xs text-gray-600">Monitoring Active</div>
          </div>
        </div>
      </motion.div>

      {/* Documentation & Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-3xl bg-white border border-gray-200 shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gray-100">
            <FileText className="w-5 h-5 text-gray-700" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Documentation & Resources</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-gray-200 hover:border-[#780096] transition-colors cursor-pointer">
            <div className="font-semibold text-sm text-gray-900 mb-1">AI Ethics Policy</div>
            <div className="text-xs text-gray-600">Comprehensive policy document outlining ethical guidelines</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 hover:border-[#780096] transition-colors cursor-pointer">
            <div className="font-semibold text-sm text-gray-900 mb-1">Compliance Reports</div>
            <div className="text-xs text-gray-600">Monthly compliance and audit reports</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 hover:border-[#780096] transition-colors cursor-pointer">
            <div className="font-semibold text-sm text-gray-900 mb-1">Bias Assessment Framework</div>
            <div className="text-xs text-gray-600">Methodology for detecting and mitigating bias</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200 hover:border-[#780096] transition-colors cursor-pointer">
            <div className="font-semibold text-sm text-gray-900 mb-1">Incident Response Plan</div>
            <div className="text-xs text-gray-600">Procedures for handling AI-related incidents</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

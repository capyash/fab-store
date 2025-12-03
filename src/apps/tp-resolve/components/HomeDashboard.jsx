import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { casesAPI } from "../services/api";
import {
  Activity,
  Clock,
  AlertTriangle,
  DollarSign,
  FileText,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Store,
} from "lucide-react";

export default function HomeDashboard({ onSelectCase, onNavigate }) {
  const [stats, setStats] = useState({
    totalCases: 0,
    appeals: 0,
    grievances: 0,
    underInvestigation: 0,
    urgentDeadlines: 0,
    resolved: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const allCases = await casesAPI.getAll({ page: 1, pageSize: 1000 });
        const cases = allCases.cases;
        
        const appeals = cases.filter(c => c.type === "Appeal").length;
        const grievances = cases.filter(c => c.type === "Grievance").length;
        const underInvestigation = cases.filter(c => c.status === "Under Investigation").length;
        const urgentDeadlines = cases.filter(c => c.daysUntilDeadline !== null && c.daysUntilDeadline < 7 && c.daysUntilDeadline >= 0).length;
        const resolved = cases.filter(c => c.status === "Resolved").length;
        const totalAmount = cases.reduce((sum, c) => sum + (c.amount || 0), 0);
        
        setStats({
          totalCases: cases.length,
          appeals,
          grievances,
          underInvestigation,
          urgentDeadlines,
          resolved,
          totalAmount,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);

  const statCards = [
    {
      title: "Total Cases",
      value: stats.totalCases,
      icon: FileText,
      gradient: "from-[#612D91] to-[#A64AC9]",
    },
    {
      title: "Appeals",
      value: stats.appeals,
      icon: AlertCircle,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Grievances",
      value: stats.grievances,
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Under Investigation",
      value: stats.underInvestigation,
      icon: Activity,
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Urgent Deadlines",
      value: stats.urgentDeadlines,
      icon: Clock,
      gradient: "from-red-500 to-orange-500",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Total Disputed Amount",
      value: `$${(stats.totalAmount / 1000).toFixed(0)}K`,
      icon: DollarSign,
      gradient: "from-amber-500 to-yellow-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#612D91]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            TP Resolve Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Appeals & Grievances Management
          </p>
        </div>
        
        {onNavigate && (
          <button
            onClick={() => onNavigate("store")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#612D91] to-[#A64AC9] rounded-lg hover:shadow-lg transition-all"
          >
            <Store className="w-4 h-4" />
            Back to Store
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} bg-opacity-10`}>
                  <Icon className={`w-5 h-5 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.title}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onSelectCase && onSelectCase({ id: "new-appeal", type: "Appeal" })}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#612D91] hover:bg-[#612D91]/5 transition-all text-left"
          >
            <div className="font-semibold text-gray-900 dark:text-white mb-1">New Appeal</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">File a new appeal case</div>
          </button>
          <button
            onClick={() => onSelectCase && onSelectCase({ id: "new-grievance", type: "Grievance" })}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#612D91] hover:bg-[#612D91]/5 transition-all text-left"
          >
            <div className="font-semibold text-gray-900 dark:text-white mb-1">New Grievance</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">File a new grievance case</div>
          </button>
          <button
            onClick={() => onNavigate && onNavigate("resolve/worklist")}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#612D91] hover:bg-[#612D91]/5 transition-all text-left"
          >
            <div className="font-semibold text-gray-900 dark:text-white mb-1">View All Cases</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Open cases worklist</div>
          </button>
        </div>
      </div>
    </div>
  );
}


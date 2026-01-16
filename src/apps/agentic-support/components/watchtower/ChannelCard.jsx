/**
 * Channel Card Component
 * Displays entry channel volume metrics
 * Author: Vinod Kumar V (VKV)
 */

import { Phone, MessageSquare, Mail, MessageCircle, FileText, Smartphone, Code, TrendingUp, TrendingDown } from "lucide-react";

const CHANNEL_ICONS = {
  voice: Phone,
  chat: MessageSquare,
  email: Mail,
  sms: MessageCircle,
  whatsapp: MessageCircle,
  web: FileText,
  mobile: Smartphone,
  api: Code,
};

const CHANNEL_COLORS = {
  voice: "text-blue-600 bg-blue-50 border-blue-200",
  chat: "text-gray-700 bg-gray-50 border-gray-200",
  email: "text-gray-700 bg-gray-50 border-gray-200",
  sms: "text-gray-700 bg-gray-50 border-gray-200",
  whatsapp: "text-gray-700 bg-gray-50 border-gray-200",
  web: "text-gray-700 bg-gray-50 border-gray-200",
  mobile: "text-gray-700 bg-gray-50 border-gray-200",
  api: "text-gray-700 bg-gray-50 border-gray-200",
};

export default function ChannelCard({ channel, volume, auto_resolved, escalated }) {
  const Icon = CHANNEL_ICONS[channel] || MessageSquare;
  const colorClass = CHANNEL_COLORS[channel] || "text-gray-700 bg-gray-50 border-gray-200";
  const channelLabel = channel.charAt(0).toUpperCase() + channel.slice(1).replace(/_/g, " ");
  
  // Calculate trend (mock for now)
  const trend = Math.random() > 0.5 ? "up" : "down";
  const trendPercent = Math.floor(Math.random() * 20) + 5;
  
  return (
    <div className={`relative rounded-lg border bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClass.split(' ')[1]} ${colorClass.split(' ')[2]}`}>
          <Icon className={`w-4 h-4 ${colorClass.split(' ')[0]}`} />
        </div>
        {trend === "up" ? (
          <TrendingUp className="w-3 h-3 text-gray-400" />
        ) : (
          <TrendingDown className="w-3 h-3 text-gray-400" />
        )}
      </div>
      
      <div className="text-2xl font-semibold text-gray-900 mb-1">{volume.toLocaleString()}</div>
      <div className="text-xs text-gray-600 mb-2">{channelLabel}</div>
      
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{trend === "up" ? "↑" : "↓"} {trendPercent}%</span>
        <span>•</span>
        <span>{auto_resolved.toLocaleString()} auto</span>
      </div>
    </div>
  );
}
